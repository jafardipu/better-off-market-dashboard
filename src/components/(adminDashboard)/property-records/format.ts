// Formatting shared by Property Contracts and Buyer Activity.
import { IPropertyContractProperty, TPropertyStatus } from "@/types";
import { priceFormatter } from "@/utils/priceFormatter";
import moment from "moment";

export const EMPTY_VALUE = "—";

export const PROPERTY_STATUSES: TPropertyStatus[] = [
  "Pending",
  "Active",
  "Under Contract",
  "Sold",
  "Rejected",
];

// The address fields both property shapes share.
export type TPropertyAddress = Partial<
  Pick<
    IPropertyContractProperty,
    "_id" | "streetAddress" | "city" | "state" | "zipCode" | "photos"
  >
>;

export const displayValue = (value?: string | null) =>
  value && value.trim() ? value : EMPTY_VALUE;

// closingDate is stored as UTC midnight. Formatting it in local time shows the
// previous day in US time zones, so read the date straight from the ISO string.
export const formatUtcDate = (iso?: string | null) => {
  const match = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return EMPTY_VALUE;
  const [, year, month, day] = match;
  return `${month}-${day}-${year}`;
};

// For real timestamps (createdAt), where the local date is the right one.
export const formatLocalDate = (iso?: string | null) =>
  iso && moment(iso).isValid() ? moment(iso).format("MM-DD-YYYY") : EMPTY_VALUE;

// NEW FLOW: activity and certification timestamps, in local time.
export const formatDateTime = (iso?: string | null) =>
  iso && moment(iso).isValid()
    ? moment(iso).format("MM-DD-YYYY h:mm A")
    : EMPTY_VALUE;

const priceWithCentsFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const formatPrice = (value?: number | null) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return EMPTY_VALUE;
  return Number.isInteger(value)
    ? priceFormatter.format(value)
    : priceWithCentsFormatter.format(value);
};

// "city, state ZIP"
export const formatCityLine = (property?: TPropertyAddress | null) => {
  const cityState = [property?.city, property?.state]
    .filter((part) => part && part.trim())
    .join(", ");
  const line = [cityState, property?.zipCode]
    .filter((part) => part && part.trim())
    .join(" ");
  return line || EMPTY_VALUE;
};

// The user profile page (it works for buyers too, despite the route name).
export const userProfileHref = (userId: string, tab?: "buyer-activity") =>
  `/seller-profile?seller=${encodeURIComponent(userId)}${tab ? `&tab=${tab}` : ""}`;
