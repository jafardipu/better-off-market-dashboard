/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tagTypes";
import { envConfig } from "@/config";
import {
  isSessionEnded,
  refreshAccessToken,
  waitForPendingRefresh,
} from "./sessionRefresh";

const baseQuery = fetchBaseQuery({
  baseUrl: envConfig.baseUrl,
  // Required for the browser to store the httpOnly refreshToken cookie at
  // login and send it back; without it a refresh can never succeed.
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const otpToken = sessionStorage.getItem("token");
    const forgotPasswordToken = sessionStorage.getItem("forgotPasswordToken");
    const signUpToken = sessionStorage.getItem("signUpToken");
    const resetPasswordToken = sessionStorage.getItem("resetPasswordToken");
    const token = (getState() as any).auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    if (otpToken) {
      headers.set("token", otpToken);
    }
    if (resetPasswordToken) {
      console.log("token", resetPasswordToken);
      headers.set("token", `${resetPasswordToken}`);
    }
    if (forgotPasswordToken) {
      headers.set("token", forgotPasswordToken);
    }
    if (signUpToken) {
      headers.set("token", signUpToken);
    }

    return headers;
  },
});

// A 401 from these means bad credentials or an OTP/reset token problem, not an
// expired access token, so it must never trigger a refresh.
const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/refresh-token",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/otp/",
];

const canRefreshFor = (args: string | FetchArgs) => {
  const url = typeof args === "string" ? args : args.url;
  const path = url.split("?")[0];
  return !NO_REFRESH_PATHS.some((prefix) => path.startsWith(prefix));
};

const getToken = (getState: () => unknown): string | null =>
  (getState() as any).auth.token;

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // If a refresh is running, wait for it so this request goes out with the
  // new token instead of failing with the old one.
  await waitForPendingRefresh();

  const sentToken = getToken(api.getState);
  let result = await baseQuery(args, api, extraOptions);

  // Only refresh when the request carried an access token: a 401 without one
  // (e.g. after logout) must not revive the session from the cookie.
  if (result.error?.status === 401 && sentToken && canRefreshFor(args)) {
    // Another request may have renewed the token while this one was in
    // flight. Reuse it rather than refreshing again.
    const currentToken = getToken(api.getState);
    const newToken =
      currentToken && currentToken !== sentToken
        ? currentToken
        : await refreshAccessToken(api);

    if (newToken) {
      // Retry exactly once, straight through baseQuery, so the retry can never
      // start another refresh. A second 401 is a permission problem, not an
      // expired session: it is returned as a normal error and the user stays
      // logged in.
      result = await baseQuery(args, api, extraOptions);
    } else if (isSessionEnded()) {
      // The user is being redirected to login, where the session-expired
      // message is shown once. Leave this request pending instead of letting
      // each caller show its own error toast before the page unloads.
      return new Promise<never>(() => {});
    }
  } else if (result?.error?.status === 403) {
    // Handle 403 status for blocked user
    // api.dispatch(logout());

    console.log("Your account has been blocked");
    // Error_Modal({ title: "Your account has been blocked" });
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,

  tagTypes: tagTypesList,
  endpoints: () => ({}),
});
