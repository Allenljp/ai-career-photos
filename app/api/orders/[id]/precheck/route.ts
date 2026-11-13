import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

/** POST /api/orders/:id/precheck — {keys[]} → {ok, perFile[]} */
export async function POST(request: Request, { params }: Ctx) {
  const body = await request.json().catch(() => ({}));
  const keys: string[] = Array.isArray(body?.keys) ? body.keys : [];

  return NextResponse.json({
    orderId: params.id,
    ok: false,
    perFile: keys.map((key) => ({
      key,
      ok: false,
      reason: "stub — face check not wired (D1)",
    })),
    stub: true,
  });
}
