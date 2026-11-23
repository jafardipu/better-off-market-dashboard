export const NOTIFICATION_TYPES = {
  propertyUnderContract: "PROPERTY_UNDER_CONTRACT",
} as const;

// Keep in sync with getNotificationUrl in public/firebase-messaging-sw.js,
// which can't import app code.
export const getNotificationLink = ({
  url,
  link,
  type,
  contractId,
}: {
  url?: string | null;
  link?: string | null;
  type?: string | null;
  contractId?: string | null;
}): string | undefined => {
  if (url) return url;
  if (link) return link;
  if (type === NOTIFICATION_TYPES.propertyUnderContract && contractId) {
    return `/property-contracts?contractId=${encodeURIComponent(contractId)}`;
  }
  return undefined;
};
