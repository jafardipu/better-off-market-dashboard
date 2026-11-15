"use client";
import { ChevronLeft, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatContact } from "./types";
import Link from "next/link";
import ImageWithFallback from "@/components/shared/image/ImageWithFallback";

type Props = {
  contact: ChatContact;
  onBack?: () => void;
};

export default function ChatHeader({ contact, onBack }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 border-b border-slate-200">
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden -ml-1 size-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 shrink-0 cursor-pointer transition-colors"
            aria-label="Back to messages"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}
        <Link
          href={`/seller-profile?seller=${contact?._id}`}
          className="relative shrink-0"
        >
          {contact?.profile ? (
            <ImageWithFallback
              src={contact.profile}
              alt="profile_image"
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "size-10 rounded-full flex items-center justify-center text-base font-semibold bg-[#DAE2FD] text-[#131B2E]",
              )}
            >
              {contact.initials}
            </div>
          )}
          {contact.online && (
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          )}
        </Link>
        <div className="min-w-0">
          <Link
            href={`/seller-profile?seller=${contact?._id}`}
            className="text-sm font-bold text-slate-900 truncate"
          >
            {contact.name}
          </Link>
          <p className="text-xs text-[#505F76]">
            {contact.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <Link href={`/seller-profile?seller=${contact?._id}`}>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-[#191C1E] gap-1.5 shrink-0 border border-slate-200 cursor-pointer"
        >
          <UserCircle2 className="size-4" />
          <span className="hidden sm:inline">View Profile</span>
        </Button>
      </Link>
    </div>
  );
}
