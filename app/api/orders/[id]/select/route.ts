import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

/** POST /api/orders/:id/select — {assetIds[4]} → {ok} */
export async function POST(request: Request, { params }: Ctx) {
  await request.json().catch(() => ({}));

  return NextResponse.json({
    orderId: params.id,
    ok: false,
    stub: true,
  });
}
