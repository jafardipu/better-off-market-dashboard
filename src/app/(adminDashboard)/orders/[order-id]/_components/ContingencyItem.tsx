import type { ReactNode } from "react";
import { ChangedText } from "./SummaryField";

interface ContingencyItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  /** Previous round's value; shown struck through when it differs. */
  previousValue?: string;
}

/** Round icon badge + stacked label/value, used for Inspection / Appraisal rows. */
export function ContingencyItem({
  icon,
  label,
  value,
  previousValue,
}: ContingencyItemProps) {
  const changed = previousValue !== undefined && previousValue !== value;

  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#91B9FF45] text-primary-color">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#594139]">
          {label}
        </p>
        {changed ? (
          <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
            <span className="text-muted-foreground line-through">
              {previousValue}
            </span>
            <ChangedText>{value}</ChangedText>
          </p>
        ) : (
          <p className="text-sm font-semibold text-foreground">{value}</p>
        )}
      </div>
    </div>
  );
}
