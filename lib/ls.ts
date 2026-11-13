import { insertEvent } from "@/lib/db";

/**
 * Server analytics / event helpers (Plausible or GA4 later).
 * Named ls.ts per build doc §16.
 */
export async function track(
  name: string,
  meta?: Record<string, unknown>,
  orderId?: string | null,
) {
  try {
    await insertEvent(name, meta ?? null, orderId ?? null);
  } catch {
    // never break UX for analytics
  }
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", name, meta ?? {}, orderId ?? "");
  }
}
