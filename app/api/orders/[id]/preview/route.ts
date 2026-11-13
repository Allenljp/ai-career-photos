import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

/** POST /api/orders/:id/preview → {jobId} */
export async function POST(_request: Request, { params }: Ctx) {
  return NextResponse.json({
    orderId: params.id,
    jobId: "00000000-0000-0000-0000-000000000001",
    stub: true,
  });
}
