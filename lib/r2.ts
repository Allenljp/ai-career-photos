import { randomUUID } from "crypto";
import { buildSignedStoragePath } from "@/lib/auth";
import { storageMode } from "@/lib/env";
import { getMemoryStore } from "@/lib/store";

/**
 * Storage: Cloudflare R2 when configured; otherwise in-memory + mock upload API.
 * Mock URLs are same-origin signed paths (HMAC + expiry), bound to an orderId.
 */

export function isMockStorage() {
  return storageMode() === "mock";
}

export async function signUploadUrls(
  count: number,
  orderId: string,
): Promise<{
  keys: string[];
  uploadUrls: string[];
  mode: "r2" | "mock";
}> {
  const n = Math.max(0, Math.min(20, Math.floor(count)));
  const batch = randomUUID().slice(0, 8);
  const keys = Array.from(
    { length: n },
    (_, i) => `uploads/${orderId}/${batch}-${i}.bin`,
  );

  const uploadUrls = keys.map((key) =>
    buildSignedStoragePath({
      method: "PUT",
      key,
      orderId,
      ttlSeconds: 60 * 30,
    }),
  );

  return {
    keys,
    uploadUrls,
    mode: storageMode() === "r2" ? "r2" : "mock",
  };
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

/** Signed same-origin URL for watermarked preview (img tags cannot send headers). */
export function publicUrlForKey(key: string, orderId: string): string {
  if (process.env.R2_PUBLIC_BASE_URL) {
    return `${process.env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
  }
  return buildSignedStoragePath({
    method: "GET",
    key,
    orderId,
    ttlSeconds: 60 * 60 * 24 * 7,
  });
}
