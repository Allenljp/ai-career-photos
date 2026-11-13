import { NextResponse } from "next/server";

/** POST /api/orders — {email, targetRole, style, fingerprint} → {orderId} */
export async function POST(request: Request) {
  await request.json().catch(() => ({}));

  return NextResponse.json({
    orderId: "00000000-0000-0000-0000-000000000000",
    stub: true,
  });
}
