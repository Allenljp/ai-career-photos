import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

/** GET /api/orders/:id/assets → {assets[]} */
export async function GET(_request: Request, { params }: Ctx) {
  return NextResponse.json({
    orderId: params.id,
    assets: [],
    stub: true,
  });
}
