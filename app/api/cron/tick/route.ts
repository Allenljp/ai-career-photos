import { NextResponse } from "next/server";

/** GET /api/cron/tick → {processed} */
export async function GET() {
  return NextResponse.json({ processed: 0, stub: true });
}
