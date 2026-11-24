import { envConfig } from "@/config";
import { jwtDecode } from "jwt-decode";
import { logout, setUser } from "../features/authSlice";

// Access-token renewal, shared by the RTK Query baseQuery and the socket.
//
// The backend keeps the refresh token in an httpOnly `refreshToken` cookie on
// the API's domain. JavaScript can't read it, and the Next.js server (including
// middleware) never receives it, so renewal can only happen here, in the
// browser, with `credentials: "include"`.

type TStoreApi = {
  dispatch: (action: any) => unknown;
  getState: () => unknown;
};

export const SESSION_EXPIRED_MESSAGE =
  "Your session has expired. Please log in again.";
const SESSION_EXPIRED_FLAG = "sessionExpired";

let pendingRefresh: Promise<string | null> | null = null;
let sessionEnded = false;

const getAuth = (getState: TStoreApi["getState"]) =>
  (getState() as any).auth as { token: string | null; user: unknown };

/** Resolves once any refresh already in progress has finished. */
export const waitForPendingRefresh = async () => {
  if (pendingRefresh) await pendingRefresh;
};

export const isSessionEnded = () => sessionEnded;

/**
 * Renews the access token. Only one refresh runs at a time: concurrent callers
 * share the same request and result.
 *
 * Resolves to the new token, or null if it couldn't be renewed. If the backend
 * rejects the refresh, the session is over: the user is logged out and sent to
 * the login page.
 */
export const refreshAccessToken = (store: TStoreApi): Promise<string | null> => {
  // Never refresh without a stored access token. There is no logout endpoint,
  // so the refreshToken cookie outlives logout and would sign the previous
  // user back in.
  if (sessionEnded || !getAuth(store.getState).token) {
    return Promise.resolve(null);
  }

  if (!pendingRefresh) {
    pendingRefresh = requestNewAccessToken(store).finally(() => {
      pendingRefresh = null;
    });
  }
  return pendingRefresh;
};

const requestNewAccessToken = async (store: TStoreApi) => {
  let response: Response;
  try {
    response = await fetch(`${envConfig.baseUrl}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Network failure: the server never answered, so the session may still be
    // valid. Keep the user logged in; the next 401 will try again.
    return null;
  }

  const body = response.ok ? await response.json().catch(() => null) : null;
  const accessToken: string | undefined = body?.data?.accessToken;

  // Any non-2xx (missing/expired cookie, deleted user, ...) ends the session.
  if (!accessToken) {
    endSession(store);
    return null;
  }

  // setUser updates Redux (persisted to localStorage) and the cookie that
  // middleware.ts checks for route protection.
  store.dispatch(
    setUser({ user: getAuth(store.getState).user, token: accessToken }),
  );
  return accessToken;
};

const endSession = (store: TStoreApi) => {
  if (sessionEnded) return;
  sessionEnded = true;

  // Same as the regular logout: clears token, user and the middleware cookie.
  // Clearing the token also makes SocketProvider disconnect the socket.
  store.dispatch(logout());

  try {
    // Don't let a slow redux-persist write bring the old token back after the
    // reload below.
    localStorage.removeItem("persist:auth");
    sessionStorage.setItem(SESSION_EXPIRED_FLAG, "1");
  } catch {
    // Storage unavailable (private mode): the logout above still applies.
  }

  // Full reload so no cached data from this session survives. The login page
  // returns to callbackUrl after signing in, and shows the message once.
  const callbackUrl = window.location.pathname + window.location.search;
  window.location.replace(
    `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
  );
};

/** True once, on the first load after a session ended. */
export const consumeSessionExpiredFlag = () => {
  try {
    if (!sessionStorage.getItem(SESSION_EXPIRED_FLAG)) return false;
    sessionStorage.removeItem(SESSION_EXPIRED_FLAG);
    return true;
  } catch {
    return false;
  }
};

/** Reads the token's exp claim without verifying it. */
export const isTokenExpired = (token: string, leewaySeconds = 0) => {
  try {
    const { exp } = jwtDecode(token);
    return !exp || exp * 1000 <= Date.now() + leewaySeconds * 1000;
  } catch {
    return true;
  }
};
