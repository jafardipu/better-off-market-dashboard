export function Pill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#DAE2FD] px-3 py-1 text-xs font-medium text-[#5C647A]">
      {children}
    </span>
  );
}