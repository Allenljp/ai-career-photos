import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

/** POST /api/orders/:id/redo → {jobId} */
export async function POST(_request: Request, { params }: Ctx) {
  return NextResponse.json({
    orderId: params.id,
    jobId: null,
    stub: true,
  });
}
