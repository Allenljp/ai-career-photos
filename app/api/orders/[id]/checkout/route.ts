import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

/** POST /api/orders/:id/checkout → {url} */
export async function POST(_request: Request, { params }: Ctx) {
  return NextResponse.json({
    orderId: params.id,
    url: null,
    stub: true,
    note: "Creem checkout wired in D2; mock-pay path available later",
  });
}
