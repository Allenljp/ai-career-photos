import { NextResponse } from "next/server";
import { createOrder } from "@/lib/db";
import { track } from "@/lib/ls";
import {
  FREE_PREVIEW_CLAIMED,
  hasClaimedFreePreview,
} from "@/lib/rate-limit";
import { clientIpFromHeaders } from "@/lib/request";

/** POST /api/orders — {email, targetRole, style, fingerprint} → {orderId} */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const fingerprint =
    typeof body?.fingerprint === "string" ? body.fingerprint.trim() : "";
  const targetRole =
    typeof body?.targetRole === "string" ? body.targetRole : "Professional";
  const style =
    typeof body?.style === "string" ? body.style : "professional";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required for your free preview." },
      { status: 400 },
    );
  }
  if (!fingerprint) {
    return NextResponse.json(
      { error: "fingerprint required" },
      { status: 400 },
    );
  }

  const ip = clientIpFromHeaders(request.headers);
  const claimed = await hasClaimedFreePreview({ email, ip, fingerprint });
  if (claimed.blocked) {
    return NextResponse.json(
      { error: FREE_PREVIEW_CLAIMED, code: "free_preview_claimed" },
      { status: 429 },
    );
  }

  const order = await createOrder({
    email,
    targetRole,
    style,
    fingerprint,
    utm: body?.utm && typeof body.utm === "object" ? body.utm : null,
  });

  await track("order_created", { email, targetRole }, order.id);

  return NextResponse.json({ orderId: order.id });
}
