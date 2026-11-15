import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFileNameFromUrl, isImageUrl } from "./Chatfileutils";
import ImageWithFallback from "@/components/shared/image/ImageWithFallback";

type Props = {
  urls: string[];
  align?: "start" | "end";
};

export default function AttachmentGrid({ urls, align = "start" }: Props) {
  const cleaned = urls.filter(Boolean);
  if (cleaned.length === 0) return null;

  const images = cleaned.filter(isImageUrl);
  const files = cleaned.filter((u) => !isImageUrl(u));

  return (
    <div
      className={cn(
        "mb-1.5 flex flex-col gap-2",
        align === "end" ? "items-end" : "items-start",
      )}
    >
      {images.length > 0 && (
        <div
          className={cn(
            "grid gap-2",
            images.length > 1 ? "grid-cols-2" : "grid-cols-1",
          )}
        >
          {images.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
              className="block overflow-hidden rounded-xl border border-slate-200 cursor-pointer"
            >
              <ImageWithFallback
                width={1200}
                height={1200}
                src={url}
                alt={getFileNameFromUrl(url)}
                className="h-30 w-30 object-cover sm:h-[150px] sm:w-[150px]"
              />
            </button>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {files.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
              className="flex max-w-64 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"
            >
              <FileText className="size-4 shrink-0 text-slate-400" />
              <span className="truncate">{getFileNameFromUrl(url)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
