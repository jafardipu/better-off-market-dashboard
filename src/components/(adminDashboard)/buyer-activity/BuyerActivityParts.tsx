"use client";
// NEW FLOW: buyer activity tracking.
import {
  BADGE_CLASS,
} from "@/components/(adminDashboard)/property-records/RecordParts";
import {
  EMPTY_VALUE,
  formatDateTime,
} from "@/components/(adminDashboard)/property-records/format";
import { cn } from "@/lib/utils";
import { IBuyerActivityTimestamps, TBuyerContactSource } from "@/types";
import { Info } from "lucide-react";
import {
  ACTIVITY_MILESTONES,
  getBuyerContactSourceLabel,
  isBuyerContactSource,
} from "./buyerActivity";

const CONTACT_SOURCE_COLORS: Record<TBuyerContactSource, string> = {
  betteroffmarket: "bg-[#DCE6FF] text-[#1F4E8B]",
  independent: "bg-[#FEF3C7] text-[#92400E]",
  unsure: "bg-gray-100 text-gray-700",
};

// The seller's answer, short label. "—" when there is no answer.
export const ContactSourceBadge = ({ source }: { source?: unknown }) => {
  if (!isBuyerContactSource(source)) return <span>{EMPTY_VALUE}</span>;
  return (
    <span className={cn(BADGE_CLASS, CONTACT_SOURCE_COLORS[source])}>
      {getBuyerContactSourceLabel(source, "short")}
    </span>
  );
};

export const NeedsReviewBadge = () => (
  <span className={cn(BADGE_CLASS, "bg-[#FEE2E2] text-[#DC2626]")}>
    Needs review
  </span>
);

export const BuyerActivityNote = () => (
  <div className="flex items-start gap-2 rounded-lg border border-[#DCE6FF] bg-[#F3F7FF] px-4 py-3 text-sm text-[#1F4E8B]">
    <Info size={16} className="mt-0.5 shrink-0" />
    <p>
      Listing views are recorded only for logged-in buyers, starting from when
      this tracking went live.
    </p>
  </div>
);

// The six "first time" timestamps as label/value rows.
export const ActivityTimeline = ({
  activity,
}: {
  activity?: Partial<IBuyerActivityTimestamps> | null;
}) => (
  <div className="divide-y divide-gray-100">
    {ACTIVITY_MILESTONES.map(({ key, label }) => (
      <div key={key} className="flex items-center justify-between gap-4 py-2">
        <span className="text-gray-500">{label}</span>
        <span className="whitespace-nowrap text-right font-medium text-black">
          {formatDateTime(activity?.[key])}
        </span>
      </div>
    ))}
  </div>
);
