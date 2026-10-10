import { extname } from "node:path";
import type { mediaPurpose } from "./db/schema.js";

export type MediaPurpose = (typeof mediaPurpose.enumValues)[number];
export const mediaMimeExtensions: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "video/mp4": [".mp4", ".m4v"],
  "video/webm": [".webm"],
  "video/quicktime": [".mov"],
};

export function validateMediaFile(name: string, contentType: string, bytes: number, purpose: MediaPurpose, maxBytes: number): string | null {
  const cleanName = name.trim();
  if (!cleanName || cleanName.length > 180 || /[\u0000-\u001f/\\]/.test(cleanName)) return "Use a simple file name without folder paths.";
  const mime = contentType.trim().toLowerCase();
  const extensions = mediaMimeExtensions[mime];
  if (!extensions) return "This image or video format is not supported.";
  if (!extensions.includes(extname(cleanName).toLowerCase())) return "The file extension must match its image or video format.";
  if (!Number.isSafeInteger(bytes) || bytes < 1) return "Choose a file that is not empty.";
  if (bytes > maxBytes) return `This file is too large. The limit for this upload is ${Math.floor(maxBytes / 1024 / 1024)} MB.`;
  if (purpose === "profile_avatar" || purpose === "brand_logo" || purpose === "product") {
    if (!mime.startsWith("image/")) return "Choose an image file for this upload.";
    if (bytes > 20 * 1024 * 1024) return "Images must be 20 MB or smaller.";
  }
  if (["brand_story", "bite", "story", "creator_portfolio"].includes(purpose) && !mime.startsWith("image/") && !mime.startsWith("video/")) {
    return "Choose an image or video for this upload.";
  }
  if (purpose === "private_test_seed" && !mime.startsWith("image/") && !mime.startsWith("video/")) return "Choose an image or video for the private test library.";
  return null;
}

export function sniffMediaType(prefix: Buffer): string | null {
  if (prefix.length >= 3 && prefix[0] === 0xff && prefix[1] === 0xd8 && prefix[2] === 0xff) return "image/jpeg";
  if (prefix.length >= 8 && prefix.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (prefix.length >= 12 && prefix.toString("ascii", 0, 4) === "RIFF" && prefix.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  if (prefix.length >= 6 && ["GIF87a", "GIF89a"].includes(prefix.toString("ascii", 0, 6))) return "image/gif";
  if (prefix.length >= 12 && prefix.toString("ascii", 4, 8) === "ftyp") {
    return prefix.toString("ascii", 8, 12) === "qt  " ? "video/quicktime" : "video/mp4";
  }
  if (prefix.length >= 4 && prefix.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) return "video/webm";
  return null;
}
