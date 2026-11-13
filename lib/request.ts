import { headers } from "next/headers";

export function clientIpFromHeaders(h: Headers): string {
  const xf = h.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "0.0.0.0";
  return h.get("x-real-ip") || h.get("cf-connecting-ip") || "0.0.0.0";
}

export function getRequestIp(): string {
  try {
    return clientIpFromHeaders(headers());
  } catch {
    return "0.0.0.0";
  }
}
