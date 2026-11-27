import { cn } from "@/lib/utils";

const PILL_VARIANTS = {
  default: "bg-[#DAE2FD] text-[#5C647A]",
  // Item added in this counter offer.
  added: "bg-amber-100 text-primary-black ring-1 ring-amber-300",
  // Item dropped since the previous round.
  removed: "bg-[#F2F4F6] text-muted-foreground line-through",
};

export function Pill({
  children,
  variant = "default",
}: {
  children: string;
  variant?: keyof typeof PILL_VARIANTS;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        PILL_VARIANTS[variant],
      )}
    >
      {children}
    </span>
  );
}
