"use client";

import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { Plus, Send, X, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  onSend: (content: string, files?: File[]) => void;
  onTyping?: () => void;
  disabled?: boolean;
};

type Attachment = {
  file: File;
  previewUrl: string | null;
};

export default function MessageInput({ onSend, onTyping, disabled }: Props) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => {
      attachments.forEach((a) => {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
      });
    };
  }, [attachments]);

  const handleSend = () => {
    if (disabled) return;
    const trimmed = value.trim();
    if (!trimmed && attachments.length === 0) return;
    onSend(
      trimmed,
      attachments.length ? attachments.map((a) => a.file) : undefined,
    );
    attachments.forEach(
      (a) => a.previewUrl && URL.revokeObjectURL(a.previewUrl),
    );
    setValue("");
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onTyping?.();
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const withPreviews: Attachment[] = selected.map((file) => ({
      file,
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));
    setAttachments((prev) => [...prev, ...withPreviews]);
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const target = prev[index];
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="border-t border-slate-200">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pt-3 sm:px-5">
          {attachments.map((a, i) =>
            a.previewUrl ? (
              <div
                key={`${a.file.name}-${i}`}
                className="relative size-16 shrink-0 rounded-xl overflow-hidden border border-slate-200 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.previewUrl}
                  alt={a.file.name}
                  className="size-full object-cover"
                />
                <button
                  onClick={() => removeAttachment(i)}
                  aria-label={`Remove ${a.file.name}`}
                  className="absolute top-1 right-1 size-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <div
                key={`${a.file.name}-${i}`}
                className="flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs rounded-full pl-2.5 pr-1 py-1 max-w-45 h-fit"
              >
                <Paperclip className="size-3 shrink-0" />
                <span className="truncate">{a.file.name}</span>
                <button
                  onClick={() => removeAttachment(i)}
                  aria-label={`Remove ${a.file.name}`}
                  className="size-4 shrink-0 rounded-full flex items-center justify-center hover:bg-slate-200"
                >
                  <X className="size-3" />
                </button>
              </div>
            ),
          )}
        </div>
      )}

      <div className="flex items-end gap-2 px-4 py-3 sm:px-5">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFilesSelected}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach files"
          disabled={disabled}
          className="size-9 shrink-0 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 mb-0.5 disabled:opacity-50"
        >
          <Plus className="size-5" />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaInput}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          disabled={disabled}
          className={cn(
            "flex-1 min-w-0 resize-none bg-slate-100 rounded-2xl px-4 py-2.5 text-sm text-slate-700",
            "placeholder:text-slate-400 outline-none leading-relaxed",
            "max-h-[120px] overflow-y-auto disabled:opacity-50",
          )}
        />

        <button
          onClick={handleSend}
          disabled={disabled}
          aria-label="Send message"
          className="size-9 shrink-0 rounded-full bg-slate-900 flex items-center justify-center text-white hover:bg-slate-800 mb-0.5 group cursor-pointer disabled:opacity-50"
        >
          <Send className="size-4 group-hover:rotate-45 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}
