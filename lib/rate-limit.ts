import { getMemoryStore } from "@/lib/store";
import type { RateLimitRow } from "@/lib/types";

export const FREE_PREVIEW_CLAIMED =
  "You've already claimed your free preview.";

function nowIso() {
  return new Date().toISOString();
}

function freeKey(kind: "email" | "ip" | "fingerprint", value: string) {
  return `free:${kind}:${value.trim().toLowerCase()}`;
}

/**
 * Free tier: 1 preview per email / IP / fingerprint (lifetime for MVP).
 * Returns true if the key may still claim a free preview.
 */
export async function checkFreePreviewLimit(key: string): Promise<boolean> {
  const row = getMemoryStore().rateLimits.get(key);
  if (!row) return true;
  return row.count < 1;
}

export async function hasClaimedFreePreview(opts: {
  email?: string | null;
  ip?: string | null;
  fingerprint?: string | null;
}): Promise<{ blocked: boolean; reason?: string }> {
  const checks: { kind: "email" | "ip" | "fingerprint"; value: string }[] = [];
  if (opts.email) checks.push({ kind: "email", value: opts.email });
  if (opts.ip) checks.push({ kind: "ip", value: opts.ip });
  if (opts.fingerprint)
    checks.push({ kind: "fingerprint", value: opts.fingerprint });

  for (const c of checks) {
    const key = freeKey(c.kind, c.value);
    const ok = await checkFreePreviewLimit(key);
    if (!ok) {
      return { blocked: true, reason: FREE_PREVIEW_CLAIMED };
    }
  }
  return { blocked: false };
}

export async function claimFreePreview(opts: {
  email?: string | null;
  ip?: string | null;
  fingerprint?: string | null;
}): Promise<void> {
  const store = getMemoryStore();
  const bump = (kind: "email" | "ip" | "fingerprint", value: string) => {
    const key = freeKey(kind, value);
    const existing = store.rateLimits.get(key);
    const row: RateLimitRow = existing
      ? { ...existing, count: existing.count + 1 }
      : { key, window_start: nowIso(), count: 1 };
    store.rateLimits.set(key, row);
  };
  if (opts.email) bump("email", opts.email);
  if (opts.ip) bump("ip", opts.ip);
  if (opts.fingerprint) bump("fingerprint", opts.fingerprint);
}
