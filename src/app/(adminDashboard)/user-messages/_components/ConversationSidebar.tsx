"use client";
import { useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import ConversationListItem from "./ConversationListItem";
import type { Conversation } from "./types";
import { cn } from "@/lib/utils";

type Props = {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
  className?: string;
};

export default function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  loading,
  className,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.trim().toLowerCase();
    return conversations.filter((c) => c.name.toLowerCase().includes(q));
  }, [conversations, search]);

  return (
    <aside className={cn("flex flex-col h-full bg-[#F2F4F6]", className)}>
      <div className="flex items-center justify-between px-4 py-4 sm:px-5">
        <h1 className="text-xl font-semibold text-[#191C1E]">Messages</h1>
      </div>

      <div className="px-4 pb-3 sm:px-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people..."
            className="w-full rounded-full bg-white px-9 py-2 text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="size-5 animate-spin text-slate-400" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-slate-400">
            No conversations found
          </p>
        ) : (
          filtered.map((c) => (
            <ConversationListItem
              key={c.id}
              conversation={c}
              active={c.id === activeId}
              onClick={() => onSelect(c.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
