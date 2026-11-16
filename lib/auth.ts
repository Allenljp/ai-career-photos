import {
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "crypto";
import { getMemoryStore } from "@/lib/store";

const TOKEN_HEADER = "x-order-token";

function signingSecret(): string {
  if (process.env.ORDER_SIGNING_SECRET) {
    return process.env.ORDER_SIGNING_SECRET;
  }
  const g = globalThis as unknown as { __achSigningSecret?: string };
  if (!g.__achSigningSecret) {
    g.__achSigningSecret = randomBytes(32).toString("hex");
  }
  return g.__achSigningSecret;
}

function hmac(payload: string): string {
  return createHmac("sha256", signingSecret())
    .update(payload)
    .digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Issue a bearer token proving ownership of an order (returned once at create). */
export function issueOrderAccessToken(orderId: string): string {
  const token = randomBytes(32).toString("base64url");
  getMemoryStore().orderTokens.set(orderId, token);
  return token;
}

export function revokeOrderAccessToken(orderId: string): void {
  getMemoryStore().orderTokens.delete(orderId);
}

export function extractOrderAccessToken(request: Request): string | null {
  const header = request.headers.get(TOKEN_HEADER);
  if (header?.trim()) return header.trim();
  const auth = request.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  const url = new URL(request.url);
  const q = url.searchParams.get("accessToken");
  return q?.trim() || null;
}

export function assertOrderAccess(
  request: Request,
  orderId: string,
): boolean {
  const token = extractOrderAccessToken(request);
  const expected = getMemoryStore().orderTokens.get(orderId);
  if (!token || !expected) return false;
  return safeEqual(token, expected);
}

export function unauthorizedOrderResponse() {
  return Response.json(
    { error: "Unauthorized for this order." },
    { status: 401 },
  );
}

type StorageMethod = "GET" | "PUT";

/** Signed relative storage URL (same-origin — avoids localhost vs 127.0.0.1 fetch failures). */
export function buildSignedStoragePath(opts: {
  method: StorageMethod;
  key: string;
  orderId: string;
  ttlSeconds?: number;
}): string {
  const expiresAt = Math.floor(Date.now() / 1000) + (opts.ttlSeconds ?? 3600);
  const sig = hmac(
    `${opts.method}\n${opts.key}\n${expiresAt}\n${opts.orderId}`,
  );
  const endpoint =
    opts.method === "PUT"
      ? "/api/mock-storage/upload"
      : "/api/mock-storage/file";
  const q = new URLSearchParams({
    key: opts.key,
    orderId: opts.orderId,
    exp: String(expiresAt),
    sig,
  });
  return `${endpoint}?${q.toString()}`;
}

export function verifySignedStorageRequest(opts: {
  method: StorageMethod;
  key: string;
  orderId: string | null;
  exp: string | null;
  sig: string | null;
}): { ok: true } | { ok: false; error: string; status: number } {
  if (!opts.key || opts.key.includes("..") || opts.key.startsWith("/")) {
    return { ok: false, error: "invalid key", status: 400 };
  }
  if (!opts.orderId || !opts.exp || !opts.sig) {
    return { ok: false, error: "missing signature", status: 401 };
  }
  const expNum = Number(opts.exp);
  if (!Number.isFinite(expNum) || expNum < Math.floor(Date.now() / 1000)) {
    return { ok: false, error: "expired", status: 401 };
  }
  // Key must belong to this order (uploads or previews prefix).
  const allowed =
    opts.key.startsWith(`uploads/${opts.orderId}/`) ||
    opts.key.startsWith(`previews/${opts.orderId}/`);
  if (!allowed) {
    return { ok: false, error: "key not bound to order", status: 403 };
  }
  const expected = hmac(
    `${opts.method}\n${opts.key}\n${expNum}\n${opts.orderId}`,
  );
  if (!safeEqual(expected, opts.sig)) {
    return { ok: false, error: "invalid signature", status: 401 };
  }
  return { ok: true };
}

export { TOKEN_HEADER };
