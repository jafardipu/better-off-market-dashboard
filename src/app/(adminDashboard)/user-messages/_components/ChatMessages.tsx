"use client";
import { useEffect, useRef } from "react";
import { Loader2, MessageCirclePlus, Pen } from "lucide-react";
import MessageBubble from "./MessageBubble";
import type { ChatMessage, SelectedUser } from "./types";

type Props = {
  messages: ChatMessage[];
  userId?: string;
  selectedUser: SelectedUser;
  loading: boolean;
  isReceiverTyping: boolean;
};

export default function ChatMessages({
  messages,
  userId,
  selectedUser,
  loading,
  isReceiverTyping,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isReceiverTyping]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-slate-400">
          <MessageCirclePlus className="size-6" />
          Start a conversation
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m, index) => {
            const previous = index > 0 ? messages[index - 1] : null;
            const showTimestamp = !previous || previous.sender !== m.sender;
            return (
              <MessageBubble
                key={m._id}
                message={m}
                userId={userId}
                showTimestamp={showTimestamp}
              />
            );
          })}

          {isReceiverTyping && (
            <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
              <Pen className="size-3" />
              {selectedUser?.name} is typing...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
