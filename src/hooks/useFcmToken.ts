"use client";

import { getToken } from "firebase/messaging";
import { getFcmMessaging } from "@/lib/firebase/messaging-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { envConfig } from "@/config";

async function fetchFcmToken(): Promise<string> {
  if (typeof window === "undefined") return "";
  if (!("serviceWorker" in navigator)) return "";
  if (!("Notification" in window)) return "";
  if (!envConfig.firebaseVapidKey) {
    console.error(
      "Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY — FCM token cannot be generated.",
    );
    return "";
  }

  const messaging = await getFcmMessaging();
  if (!messaging) return "";

  if (Notification.permission === "denied") return "";

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );
  await navigator.serviceWorker.ready;

  const permission =
    Notification.permission === "granted"
      ? Notification.permission
      : await Notification.requestPermission();

  if (permission !== "granted") return "";

  const currentToken = await getToken(messaging, {
    vapidKey: envConfig.firebaseVapidKey,
    serviceWorkerRegistration: registration,
  });

  return currentToken || "";
}

const useFcmToken = () => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("");
  const [isLoading, setIsLoading] = useState(true);
  const tokenRef = useRef("");

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined" && "Notification" in window) {
          setNotificationPermissionStatus(Notification.permission);
        }

        const currentToken = await fetchFcmToken();
        if (currentToken) {
          tokenRef.current = currentToken;
          setToken(currentToken);
        }

        if (typeof window !== "undefined" && "Notification" in window) {
          setNotificationPermissionStatus(Notification.permission);
        }
      } catch (error) {
        console.error("An error occurred while retrieving token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    retrieveToken();
  }, []);

  const getFcmToken = useCallback(async () => {
    if (tokenRef.current) return tokenRef.current;

    try {
      const currentToken = await fetchFcmToken();
      if (currentToken) {
        tokenRef.current = currentToken;
        setToken(currentToken);
      }
      if (typeof window !== "undefined" && "Notification" in window) {
        setNotificationPermissionStatus(Notification.permission);
      }
      return currentToken;
    } catch (error) {
      console.error("An error occurred while retrieving token:", error);
      return "";
    }
  }, []);

  return {
    fcmToken: token,
    notificationPermissionStatus,
    isLoading,
    getFcmToken,
  };
};

export default useFcmToken;
