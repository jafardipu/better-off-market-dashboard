"use client";

import { envConfig } from "@/config";
import { selectToken } from "@/redux/features/authSlice";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
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

    socketStore.on("connect", handleConnect);
    socketStore.on("disconnect", handleDisconnect);
    setSocket(socketStore);

    return () => {
      socketStore.off("connect", handleConnect);
      socketStore.off("disconnect", handleDisconnect);
      socketStore.disconnect();
      setSocket(null);
      setSocketLoading(false);
    };
  }, [token]);

  const value = useMemo(
    () => ({ socket, socketLoading }),
    [socket, socketLoading],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
