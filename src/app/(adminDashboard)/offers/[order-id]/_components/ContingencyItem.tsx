import type { ReactNode } from "react";

interface ContingencyItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

/** Round icon badge + stacked label/value, used for Inspection / Appraisal rows. */
export function ContingencyItem({ icon, label, value }: ContingencyItemProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#91B9FF45] text-primary-color">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#594139]">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}