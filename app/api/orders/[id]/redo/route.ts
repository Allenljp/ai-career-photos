import { NextResponse } from "next/server";
import {
  assertOrderAccess,
  unauthorizedOrderResponse,
} from "@/lib/auth";

type Ctx = { params: { id: string } };

/** POST /api/orders/:id/redo → {jobId} */
export async function POST(request: Request, { params }: Ctx) {
  if (!assertOrderAccess(request, params.id)) {
    return unauthorizedOrderResponse();
  }
  return NextResponse.json({
    orderId: params.id,
    jobId: null,
    stub: true,
  });
}
