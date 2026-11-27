import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SummaryFieldProps {
  label: string;
  value: string;
  /** Previous round's value; shown struck through when it differs. */
  previousValue?: string;
  className?: string;
}

const readable = (value?: string) => value?.split("_").join(" ");

/** Uppercase muted label with a bold value beneath it, e.g. OFFER AMOUNT / $48,500 */
export function SummaryField({
  label,
  value,
  previousValue,
  className,
}: SummaryFieldProps) {
  const changed = previousValue !== undefined && previousValue !== value;

  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#594139]">
        {label}
      </p>
      {changed ? (
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 capitalize">
          <span className="text-sm text-muted-foreground line-through">
            {readable(previousValue)}
          </span>
          <ChangedText className="md:text-lg text-sm">
            {readable(value)}
          </ChangedText>
        </p>
      ) : (
        <p className="mt-1 md:text-lg text-sm text-primary-black capitalize">
          {readable(value)}
        </p>
      )}
    </div>
  );
}

/** The new value of a field that changed in this counter offer. */
export function ChangedText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded bg-amber-100 px-1 font-semibold text-primary-black",
        className,
      )}
    >
      {children}
    </span>
  );
}
