"use client";
import { tagTypes } from "@/redux/tagTypes";
import { onMessage } from "firebase/messaging";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import CustomToast from "@/components/shared/utils/CustomToast";
import notificationApi from "@/redux/api/notificationApi";
import { getFcmMessaging } from "@/lib/firebase/messaging-client";

const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    let unsubscribe: (() => void) | undefined;

    const setup = async () => {
      try {
        // Keep SW registered for both foreground + background delivery
        await navigator.serviceWorker.register("/firebase-messaging-sw.js");

        const messaging = await getFcmMessaging();
        if (!messaging) return;

        unsubscribe = onMessage(messaging, (payload) => {
          const title =
            payload.notification?.title ||
            payload.data?.title ||
            payload.data?.message;
          const body =
            payload.notification?.body ||
            payload.data?.body ||
            payload.data?.description;
          const url = payload.data?.url || payload.data?.link || "/notifications";

          // Always refresh notification list / unread badge
          dispatch(
            notificationApi.util.invalidateTags([tagTypes.notifications]),
          );

          if (!title && !body) return;

          toast.custom(
            () => <CustomToast title={title} body={body} url={url} />,
            { position: "bottom-left" },
          );
        });
      } catch (error) {
        console.error("Failed to initialize Firebase messaging:", error);
      }
    };

    setup();

    return () => {
      unsubscribe?.();
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default FirebaseProvider;
