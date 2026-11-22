// components/shared/ReadMoreText.tsx
"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface ReadMoreTextProps {
  text: string;
  wordLimit?: number;
  className?: string;
}

/** Truncate by word count while keeping original newlines/spacing up to that point. */
function truncatePreservingWhitespace(text: string, wordLimit: number) {
  const matches = [...text.matchAll(/\S+/g)];
  if (matches.length <= wordLimit) return text;

  const last = matches[wordLimit - 1];
  const end = (last.index ?? 0) + last[0].length;
  return `${text.slice(0, end)}...`;
}

export default function ReadMoreText({
  text,
  wordLimit = 100,
  className,
}: ReadMoreTextProps) {
  const [expanded, setExpanded] = useState(false);

  const words = useMemo(() => text?.trim().match(/\S+/g) ?? [], [text]);
  const isLong = words.length > wordLimit;

  const displayText =
    expanded || !isLong
      ? text
      : truncatePreservingWhitespace(text ?? "", wordLimit);

  return (
    <>
      <p className={cn("whitespace-pre-wrap", className)}>{displayText}</p>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-[#1F4E8B] font-semibold text-sm hover:underline cursor-pointer"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </>
  );
}
