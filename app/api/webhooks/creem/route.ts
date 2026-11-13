import { NextResponse } from "next/server";

/** POST /api/webhooks/creem — verify signature, mark paid, enqueue full job */
export async function POST() {
  return NextResponse.json({ received: true, stub: true }, { status: 200 });
}
