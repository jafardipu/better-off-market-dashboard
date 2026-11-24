// NEW FLOW: buyer activity tracking and the seller's buyer-contact answer.
// Admins use these to decide whether the 2% Buyer Platform Fee is owed.
import {
  IBuyerActivityTimestamps,
  IPropertyContract,
  TBuyerContactSource,
  TContractSource,
} from "@/types";

const BUYER_CONTACT_SOURCES: Record<
  TBuyerContactSource,
  { short: string; full: string }
> = {
  betteroffmarket: {
    short: "Through BetterOffMarket",
    full: "The buyer first contacted me about this property through BetterOffMarket.",
  },
  independent: {
    short: "Independent of BetterOffMarket",
    full: "The buyer first contacted me about this property through another source, independently of BetterOffMarket.",
  },
  unsure: {
    short: "Unsure",
    full: "I am unsure / unable to determine.",
  },
};

export const BUYER_CONTACT_SOURCE_VALUES = Object.keys(
  BUYER_CONTACT_SOURCES,
) as TBuyerContactSource[];

export const isBuyerContactSource = (
  value: unknown,
): value is TBuyerContactSource =>
  BUYER_CONTACT_SOURCE_VALUES.includes(value as TBuyerContactSource);

// undefined for older records without an answer (shown as "—").
export const getBuyerContactSourceLabel = (
  source: unknown,
  variant: "short" | "full",
) => (isBuyerContactSource(source) ? BUYER_CONTACT_SOURCES[source][variant] : undefined);

const CONTRACT_SOURCES: Record<TContractSource, string> = {
  offer_accepted: "Accepted offer",
  manual: "Marked manually",
};

export const CONTRACT_SOURCE_VALUES = Object.keys(
  CONTRACT_SOURCES,
) as TContractSource[];

export const isContractSource = (value: unknown): value is TContractSource =>
  CONTRACT_SOURCE_VALUES.includes(value as TContractSource);

export const getContractSourceLabel = (source: unknown) =>
  isContractSource(source) ? CONTRACT_SOURCES[source] : undefined;

export const ACTIVITY_MILESTONES: {
  key: keyof IBuyerActivityTimestamps;
  label: string;
}[] = [
  { key: "firstViewedAt", label: "First viewed" },
  { key: "firstSavedAt", label: "First saved" },
  { key: "firstRsvpAt", label: "First RSVP" },
  { key: "firstMessagedSellerAt", label: "First message to seller" },
  { key: "firstOfferSubmittedAt", label: "First offer" },
  { key: "firstNegotiationAt", label: "Entered negotiations" },
];

export const BUYER_ACTIVITY_FILTER_KEYS = ["buyer", "property", "seller"] as const;
export type TBuyerActivityFilterKey = (typeof BUYER_ACTIVITY_FILTER_KEYS)[number];
export type TBuyerActivityFilters = Partial<
  Record<TBuyerActivityFilterKey, string | null>
>;

// Query params for GET /buyer-activities, leaving out empty values. Built the
// same way everywhere so identical requests share one RTK Query cache entry.
export const getBuyerActivityArgs = ({
  page,
  limit,
  searchTerm,
  ...filters
}: TBuyerActivityFilters & {
  page: number | string;
  limit: number | string;
  searchTerm?: string;
}) => {
  const args: Record<string, string> = {
    page: String(page),
    limit: String(limit),
  };
  if (searchTerm) args.searchTerm = searchTerm;
  BUYER_ACTIVITY_FILTER_KEYS.forEach((key) => {
    const value = filters[key];
    if (value) args[key] = value;
  });
  return args;
};

export const buyerActivityHref = (filters: TBuyerActivityFilters) => {
  const params = new URLSearchParams();
  BUYER_ACTIVITY_FILTER_KEYS.forEach((key) => {
    const value = filters[key];
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `/buyer-activity?${query}` : "/buyer-activity";
};

// Everyone who interacted with the contract's listing, narrowed to the
// contract's buyer when they are a BetterOffMarket user.
export const contractBuyerActivityHref = (contract: IPropertyContract) =>
  buyerActivityHref({
    property: contract.property?._id,
    buyer: contract.buyer?._id,
  });
