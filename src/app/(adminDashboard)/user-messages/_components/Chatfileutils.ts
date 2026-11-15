const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "bmp",
  "avif",
];

export function getFileExtension(url: string): string {
  const clean = url.split("?")[0].split("#")[0];
  const parts = clean.split(".");
  return parts.length > 1 ? (parts.pop() as string).toLowerCase() : "";
}

export function isImageUrl(url: string): boolean {
  return IMAGE_EXTENSIONS.includes(getFileExtension(url));
}

export function getFileNameFromUrl(url: string): string {
  try {
    const clean = url.split("?")[0];
    const segments = clean.split("/");
    return decodeURIComponent(segments[segments.length - 1] || "file");
  } catch {
    return "file";
  }
}

export function initialsFromName(name?: string): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
