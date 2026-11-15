"use client";
import { cn } from "@/lib/utils";
import type { Conversation } from "./types";
import ImageWithFallback from "@/components/shared/image/ImageWithFallback";

type Props = {
  conversation: Conversation;
  active?: boolean;
  onClick?: () => void;
};

export default function ConversationListItem({
  conversation,
  active,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3 text-left border-l-2 transition-colors bg-white",
        active
          ? "bg-[#F0F7FF] border-l-main-color"
          : "border-l-transparent hover:bg-slate-50",
      )}
    >
      <div className="relative shrink-0">
        {conversation?.profile ? (
          <ImageWithFallback
            src={conversation.profile}
            alt="user avatar"
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "size-10 rounded-full flex items-center justify-center text-base font-semibold",
              active
                ? "bg-[#DAE2FD] text-[#131B2E]"
                : "bg-[#5C647A] text-white",
            )}
          >
            {conversation.initials}
          </div>
        )}
        {conversation.online && (
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-[#191C1E] truncate">
            {conversation.name}
          </span>
          <span className="text-xs text-[#594139] font-semibold shrink-0">
            {conversation.timestamp}
          </span>
        </div>
        <p
          className={cn(
            "text-sm text-[#594139] truncate mt-0.5",
            conversation.unread && "font-bold text-[#191C1E]",
          )}
        >
          {conversation.lastMessage}
        </p>
      </div>
    </button>
  );
}
