import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { TagStarIcon } from "@/icon";

interface OfferComparisonCardProps {
  title: string;
  amount: number;
  previousAmount?: number;
  closingDate: string;
  previousClosingDate?: string;
  closingLabel?: string;
  badgeNumber?: number;
  highlighted?: boolean;
  onClick?: () => void;
}

function formatCurrency(amount: number) {
  return amount?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function OfferComparisonCard({
  title,
  amount,
  previousAmount,
  closingDate,
  previousClosingDate,
  closingLabel = "Closing:",
  badgeNumber,
  highlighted,
  onClick,
}: OfferComparisonCardProps) {
  const amountChanged =
    previousAmount !== undefined && previousAmount !== amount;
  const dateChanged =
    previousClosingDate !== undefined && previousClosingDate !== closingDate;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full flex-1 rounded-lg border p-4 text-left transition-colors cursor-pointer",
        highlighted
          ? "border-primary-border-color bg-[#AC34000D] ring-1 ring-primary-color"
          : "border-none bg-[#F2F4F6] hover:bg-[#e9ebee]",
      )}
    >
      {badgeNumber !== undefined ? (
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white">
          <TagStarIcon />
        </span>
      ) : null}

      <p className="text-sm font-semibold text-primary-color">{title}</p>

      <p className="mt-2 flex flex-wrap items-baseline gap-2">
        {amountChanged ? (
          <span className="text-base text-muted-foreground line-through">
            {formatCurrency(previousAmount)}
          </span>
        ) : null}
        <span className="text-xl font-semibold text-foreground">
          {formatCurrency(amount)}
        </span>
      </p>

      <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Calendar size={13} />
        {dateChanged ? (
          <>
            <span>{closingLabel}</span>
            <span className="line-through">{previousClosingDate}</span>
            <span className="font-medium text-foreground">{closingDate}</span>
          </>
        ) : (
          <>
            <span>{closingLabel}</span>
            <span className="font-medium text-foreground">{closingDate}</span>
          </>
        )}
      </p>
    </button>
  );
}