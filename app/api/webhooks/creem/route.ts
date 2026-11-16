import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

/**
 * POST /api/webhooks/creem — verify HMAC, mark paid, enqueue full job.
 * Rejects when CREEM_WEBHOOK_SECRET is unset (no open stub).
 */
export async function POST(request: Request) {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "webhook not configured" },
      { status: 503 },
    );
  }

  const raw = await request.text();
  const signature =
    request.headers.get("creem-signature") ||
    request.headers.get("x-creem-signature") ||
    "";

  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  // D2: parse event, mark paid, enqueue full job (idempotent by creem_order_id).
  return NextResponse.json({ received: true, stub: true }, { status: 200 });
}
