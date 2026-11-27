export interface ConsolidatedOfferDocument {
  name: string;
  url: string;
}

export interface ConsolidatedOfferData {
  offerAmount: number;
  earnestMoney: number;
  financingType: string;
  financingTerms: string;
  closingCosts: string;
  commission?: string;
  personalProperty: {
    included: string[];
    itemsToRemove?: string;
  };
  inspection: { required: boolean; days?: number };
  appraisal: { required: boolean; days?: number };
  closingTerms: {
    titleCompany: string;
    closingDate: string;
    possession: string;
    sellerPostClosingDays?: number;
  };
  agent?: {
    hasAgent: boolean;
    agentName?: string;
    brokerageName?: string;
    commission?: string;
    paidBy?: string;
  };
  documents?: ConsolidatedOfferDocument[];
  notesToSeller?: string;
  additionalTerms?: string;
  sellerPostClosingDays?: number;
  notesToBuyer?: string;
}

// Shape of currentTerms / each history[] entry from the API
export interface OfferTerms {
  offerAmount: number;
  earnestMoney: number;
  financingType: string;
  financingTerms?: string;
  otherFinancingType?: string;
  closingCostOption: string;
  sellerContribution?: number;
  inspectionContingency: string;
  inspectionDays?: number;
  appraisalContingency: string;
  commission?: string;
  paidBy?: string;
  hasAgent: string;
  agentName?: string;
  brokerageName?: string;
  personalPropertyIncluded?: string;
  itemsToBeRemoved?: string;
  titleCompany: string;
  closingDate: string;
  possession: string;
  sellerPostClosingDays?: number;
  notesToSeller?: string;
  notesToBuyer?: string;
  additionalTerms?: string;
  madeBy?: "buyer" | "seller";
}

// A full history[] entry — same shape as OfferTerms, plus round metadata.
export interface OfferHistoryEntry extends OfferTerms {
  round: number;
  madeBy: "buyer" | "seller";
  madeByUser: string;
  status: string;
  createdAt: string;
}

interface RawSupportingDocument {
  name: string;
  url: string;
}

export function formatCurrency(amount: number) {
  return amount?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  });
}

export function contingencyValue(item: { required: boolean; days?: number }) {
  if (!item.required) return "Waived";
  return item.days ? `Yes, ${item.days} days` : "Yes";
}

const FINANCING_TYPE_LABELS: Record<string, string> = {
  cash: "Cash",
  conventional: "Conventional",
  hard_money: "Hard Money",
  fha: "FHA",
  va: "VA",
};

export function formatFinancingType(type: string, otherType?: string) {
  if (type === "other" && otherType) return otherType;
  return FINANCING_TYPE_LABELS[type] ?? type;
}

export function formatPossession(possession: string) {
  if (possession === "at_closing") return "At closing";
  return possession
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatClosingCosts(
  option: string,
  sellerContribution?: number,
) {
  if (option === "requested") {
    return sellerContribution
      ? `Buyer requests seller contribution of ${formatCurrency(sellerContribution)}`
      : "Buyer requests seller contribution";
  }
  return "Buyer does NOT request seller contribution";
}

export function formatCommission(commission?: string, paidBy?: string) {
  if (!commission) return undefined;
  return paidBy ? `${commission} (paid by ${paidBy})` : commission;
}

export function splitToList(value?: string) {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}

// Used on the SELLER's "offers received" view — labels the round from the seller's perspective.
export function getRoundTitle(madeBy?: "buyer" | "seller") {
  return madeBy === "seller" ? "Your Counter Offer" : "Buyer's Offer";
}

// Used on the BUYER's "offers sent" view — labels the round from the buyer's perspective,
// the inverse of getRoundTitle above, since here "you" are the buyer.
export function getRoundTitleForBuyer(madeBy: "buyer" | "seller", round: number) {
  if (madeBy === "buyer") {
    return round === 1 ? "Your Offer" : "Your Counter Offer";
  }
  return "Seller's Counter Offer";
}

export function mapTermsToConsolidatedOfferData(
  terms: OfferTerms,
  documents?: RawSupportingDocument[],
): ConsolidatedOfferData {
  return {
    offerAmount: terms.offerAmount,
    earnestMoney: terms.earnestMoney,
    financingType: formatFinancingType(
      terms.financingType,
      terms.otherFinancingType,
    ),
    closingCosts: formatClosingCosts(
      terms.closingCostOption,
      terms.sellerContribution,
    ),
    financingTerms: terms?.financingTerms ?? "",
    personalProperty: {
      included: splitToList(terms.personalPropertyIncluded),
      itemsToRemove: terms.itemsToBeRemoved,
    },
    inspection: {
      required: terms.inspectionContingency === "yes",
      days: terms.inspectionDays,
    },
    appraisal: {
      required: terms.appraisalContingency === "yes",
    },
    closingTerms: {
      titleCompany: terms.titleCompany,
      closingDate: formatDate(terms.closingDate),
      possession: formatPossession(terms.possession),
      sellerPostClosingDays: terms?.sellerPostClosingDays,
    },
    agent: {
      hasAgent: terms.hasAgent === "yes",
      agentName: terms.agentName,
      brokerageName: terms.brokerageName,
      commission: terms.commission,
      paidBy: terms.paidBy,
    },
    documents: documents?.map((doc) => ({ name: doc.name, url: doc.url })),
    notesToSeller: terms.notesToSeller,
    notesToBuyer: terms.notesToBuyer,
    additionalTerms: terms.additionalTerms,
  };
}

// ---------------------------------------------------------------------------
// Counter-offer diff: compares two rounds by the text the card displays, so a
// field counts as changed only when what the admin sees is different.
// ---------------------------------------------------------------------------

export const EMPTY_TERM = "—";

const capitalize = (value?: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

export function getOfferDisplayValues(data: ConsolidatedOfferData) {
  const hasAgent = Boolean(data.agent?.hasAgent);
  return {
    offerAmount: formatCurrency(data.offerAmount) || EMPTY_TERM,
    earnestMoney: formatCurrency(data.earnestMoney) || EMPTY_TERM,
    financingType: data.financingType || EMPTY_TERM,
    financingTerms: data.financingTerms || EMPTY_TERM,
    closingCosts: data.closingCosts || EMPTY_TERM,
    includedItems: data.personalProperty.included.join(", ") || EMPTY_TERM,
    itemsToRemove:
      splitToList(data.personalProperty.itemsToRemove).join(", ") || EMPTY_TERM,
    inspection: contingencyValue(data.inspection),
    appraisal: contingencyValue(data.appraisal),
    hasAgent: hasAgent ? "Yes" : "No",
    // Agent details only count while the buyer has an agent.
    agentName: (hasAgent && data.agent?.agentName) || EMPTY_TERM,
    brokerageName: (hasAgent && data.agent?.brokerageName) || EMPTY_TERM,
    commission: (hasAgent && data.agent?.commission) || EMPTY_TERM,
    paidBy: (hasAgent && capitalize(data.agent?.paidBy)) || EMPTY_TERM,
    titleCompany: data.closingTerms.titleCompany || EMPTY_TERM,
    closingDate: data.closingTerms.closingDate || EMPTY_TERM,
    possession: data.closingTerms.possession || EMPTY_TERM,
    sellerPostClosingDays:
      data.closingTerms.sellerPostClosingDays?.toString() ?? EMPTY_TERM,
    additionalTerms: data.additionalTerms || EMPTY_TERM,
  };
}

export type OfferDisplayValues = ReturnType<typeof getOfferDisplayValues>;
export type OfferDiffKey = keyof OfferDisplayValues;

export const OFFER_DIFF_LABELS: Record<OfferDiffKey, string> = {
  offerAmount: "Offer amount",
  earnestMoney: "Earnest money",
  financingType: "Financing type",
  financingTerms: "Financing terms",
  closingCosts: "Closing costs",
  includedItems: "Included items",
  itemsToRemove: "Items to be removed",
  inspection: "Inspection",
  appraisal: "Appraisal",
  hasAgent: "Working with an agent",
  agentName: "Agent name",
  brokerageName: "Brokerage name",
  commission: "Commission",
  paidBy: "Commission paid by",
  titleCompany: "Title company",
  closingDate: "Closing date",
  possession: "Possession",
  sellerPostClosingDays: "Seller post-closing occupancy",
  additionalTerms: "Additional terms",
};

/** Previous round's display value for every field that changed, keyed by field. */
export function getOfferChanges(
  current: OfferDisplayValues,
  previous?: OfferDisplayValues,
): Partial<Record<OfferDiffKey, string>> {
  if (!previous) return {};
  const changes: Partial<Record<OfferDiffKey, string>> = {};
  (Object.keys(current) as OfferDiffKey[]).forEach((key) => {
    if (current[key] !== previous[key]) changes[key] = previous[key];
  });
  return changes;
}

/** Items kept, added and dropped between two rounds, for pill lists. */
export function diffItems(current: string[], previous?: string[]) {
  if (!previous) {
    return { items: current, added: new Set<string>(), removed: [] as string[] };
  }
  return {
    items: current,
    added: new Set(current.filter((item) => !previous.includes(item))),
    removed: previous.filter((item) => !current.includes(item)),
  };
}

export const OFFER_STATUS = {
  pending: "pending",
  countered: "countered",
  accepted: "accepted",
  rejected: "rejected",
  withdrawn: "withdrawn",
} as const;

export const OFFER_STATUS_OPTIONS = Object.values(OFFER_STATUS);

export const CLOSED_OFFER_STATUSES: string[] = [
  OFFER_STATUS.accepted,
  OFFER_STATUS.rejected,
  OFFER_STATUS.withdrawn,
];