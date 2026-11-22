import { cn } from "@/lib/utils";

interface SummaryFieldProps {
  label: string;
  value: string;
  className?: string;
}

/** Uppercase muted label with a bold value beneath it, e.g. OFFER AMOUNT / $48,500 */
export function SummaryField({
  label,
  value,
  className
}: SummaryFieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#594139]">
        {label}
      </p>
      <p className={cn("mt-1  md:text-lg text-sm text-primary-black capitalize")}>
        {value?.split("_").join(" ")}
      </p>
    </div>
  );
}
