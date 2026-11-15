"use client";
import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import FirebaseProvider from "./FirebaseProvider";
import { SocketProvider } from "@/context/SocketContextApi";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <FirebaseProvider>{children}</FirebaseProvider>
        </SocketProvider>
      </PersistGate>
    </Provider>
  );
};

export default Providers;
