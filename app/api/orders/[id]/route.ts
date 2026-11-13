import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

/** GET /api/orders/:id → {status, previewUrl?, score?} */
export async function GET(_request: Request, { params }: Ctx) {
  return NextResponse.json({
    orderId: params.id,
    status: "created",
    previewUrl: null,
    score: null,
    stub: true,
  });
}

/** DELETE /api/orders/:id → 204 (GDPR) */
export async function DELETE(_request: Request, { params }: Ctx) {
  void params.id;
  return new NextResponse(null, { status: 204 });
}
