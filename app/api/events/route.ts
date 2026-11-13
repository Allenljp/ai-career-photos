import { NextResponse } from "next/server";
import { track } from "@/lib/ls";

/** POST /api/events — client analytics stub */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = typeof body?.name === "string" ? body.name : null;
  if (!name) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }
  const meta =
    body?.meta && typeof body.meta === "object"
      ? (body.meta as Record<string, unknown>)
      : undefined;
  const orderId =
    typeof body?.orderId === "string" ? (body.orderId as string) : null;
  await track(name, meta, orderId);
  return NextResponse.json({ ok: true });
}
