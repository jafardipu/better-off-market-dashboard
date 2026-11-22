import type { ReactNode } from "react";

interface OfferSubSectionProps {
  title: string;
  icon?: ReactNode;
  onEdit?: () => void;
  children: ReactNode;
}

/** One row inside <ConsolidatedOfferCard>, separated from its neighbors by the parent's divide-y. */
export function OfferSubSection({ title, icon, children }: OfferSubSectionProps) {
  return (
    <div className="py-5  shadow-[0_10px_30px_0_rgba(15,23,42,0.05)] border border-primary-border-color rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 sm:text-xl text-lg font-semibold text-primary-color">
          {icon ? <span className="text-primary">{icon}</span> : null}
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
