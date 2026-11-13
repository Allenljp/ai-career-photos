import { randomUUID } from "crypto";
import { siteUrl, storageMode } from "@/lib/env";
import { getMemoryStore } from "@/lib/store";

/**
 * Storage: Cloudflare R2 when configured; otherwise in-memory + mock upload API.
 * Real AWS S3 SDK wiring lands when R2_* secrets exist (D2).
 */

export function isMockStorage() {
  return storageMode() === "mock";
}

export async function signUploadUrls(count: number): Promise<{
  keys: string[];
  uploadUrls: string[];
  mode: "r2" | "mock";
}> {
  const n = Math.max(0, Math.min(20, Math.floor(count)));
  const batch = randomUUID().slice(0, 8);
  const keys = Array.from({ length: n }, (_, i) => `uploads/${batch}/${i}.bin`);
  const base = siteUrl();

  if (storageMode() === "r2") {
    // 假设: without AWS SDK installed, return structured placeholders that
    // still look like signed URLs so the client contract stays stable.
    // Real PutObject signed URLs require R2 creds + @aws-sdk/client-s3 (D2).
    const uploadUrls = keys.map(
      (key) =>
        `${base}/api/mock-storage/upload?key=${encodeURIComponent(key)}&mode=r2-pending`,
    );
    return { keys, uploadUrls, mode: "r2" };
  }

  const uploadUrls = keys.map(
    (key) => `${base}/api/mock-storage/upload?key=${encodeURIComponent(key)}`,
  );
  return { keys, uploadUrls, mode: "mock" };
}

export async function putObject(
  key: string,
  body: Buffer,
  _contentType?: string,
): Promise<void> {
  getMemoryStore().files.set(key, body);
}

export async function getObject(key: string): Promise<Buffer | null> {
  return getMemoryStore().files.get(key) ?? null;
}

export async function deleteObject(key: string): Promise<void> {
  getMemoryStore().files.delete(key);
}

/** Public-ish URL for watermarked preview (mock serves via API). */
export function publicUrlForKey(key: string): string {
  const base = siteUrl();
  if (process.env.R2_PUBLIC_BASE_URL) {
    return `${process.env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
  }
  return `${base}/api/mock-storage/file?key=${encodeURIComponent(key)}`;
}
