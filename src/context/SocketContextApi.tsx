"use client";

import { envConfig } from "@/config";
import { selectToken } from "@/redux/features/authSlice";
import {
  isTokenExpired,
  refreshAccessToken,
} from "@/redux/api/sessionRefresh";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector, useStore } from "react-redux";
import { io, Socket } from "socket.io-client";

type TSocketContext = {
  socket: Socket | null;
  socketLoading: boolean;
};

const SocketContext = createContext<TSocketContext>({
  socket: null,
  socketLoading: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const token = useSelector(selectToken);
  const store = useStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketLoading, setSocketLoading] = useState(false);

  useEffect(() => {
    if (!token || !envConfig.socketApi) {
      setSocket(null);
      setSocketLoading(false);
      return;
    }

    setSocketLoading(true);

    const socketStore = io(envConfig.socketApi, {
      transports: ["websocket"],
      auth: { token },
    });

    const handleConnect = () => setSocketLoading(false);
    const handleDisconnect = () => setSocketLoading(true);

    // The backend checks the token only when a socket connects. If the server
    // rejected it (socket inactive) because the token expired, renew it. The
    // new token re-runs this effect, which reconnects with it; if renewal is
    // rejected, refreshAccessToken logs the user out. A fresh token that is
    // still rejected isn't expired, so this can't loop.
    const handleConnectError = () => {
      if (!socketStore.active && isTokenExpired(token, 30)) {
        refreshAccessToken(store);
      }
    };

    socketStore.on("connect", handleConnect);
    socketStore.on("disconnect", handleDisconnect);
    socketStore.on("connect_error", handleConnectError);
    setSocket(socketStore);

    return () => {
      socketStore.off("connect", handleConnect);
      socketStore.off("disconnect", handleDisconnect);
      socketStore.off("connect_error", handleConnectError);
      socketStore.disconnect();
      setSocket(null);
      setSocketLoading(false);
    };
  }, [token, store]);

  const value = useMemo(
    () => ({ socket, socketLoading }),
    [socket, socketLoading],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
