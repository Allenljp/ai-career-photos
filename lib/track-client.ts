/** Browser-side tracker — fire-and-forget to /api/events */
export function trackClient(
  name: string,
  meta?: Record<string, unknown>,
  orderId?: string | null,
) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({ name, meta, orderId });
  try {
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon(
        "/api/events",
        new Blob([payload], { type: "application/json" }),
      );
      if (ok) return;
    }
  } catch {
    // fall through
  }
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
}

const FP_KEY = "ach_fingerprint";
const ORDER_TOKEN_PREFIX = "ach_order_token_";

export function saveOrderAccessToken(orderId: string, token: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`${ORDER_TOKEN_PREFIX}${orderId}`, token);
  } catch {
    // ignore quota / private mode
  }
}

export function loadOrderAccessToken(orderId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(`${ORDER_TOKEN_PREFIX}${orderId}`);
  } catch {
    return null;
  }
}

export function orderAuthHeaders(orderId: string): HeadersInit {
  const token = loadOrderAccessToken(orderId);
  return token ? { "x-order-token": token } : {};
}

/** Stable device fingerprint for free-tier rate limit (local UUID + UA hash). */
export function getOrCreateFingerprint(): string {
  if (typeof window === "undefined") return "server";
  try {
    const existing = localStorage.getItem(FP_KEY);
    if (existing) return existing;
    const seed = [
      navigator.userAgent,
      navigator.language,
      String(screen.width),
      String(screen.height),
      String(new Date().getTimezoneOffset()),
    ].join("|");
    const id = `fp_${simpleHash(seed)}_${crypto.randomUUID().slice(0, 8)}`;
    localStorage.setItem(FP_KEY, id);
    return id;
  } catch {
    return `fp_anon_${Date.now()}`;
  }
}

function simpleHash(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}
