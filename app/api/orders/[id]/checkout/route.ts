import { NextResponse } from "next/server";
import {
  assertOrderAccess,
  unauthorizedOrderResponse,
} from "@/lib/auth";

type Ctx = { params: { id: string } };

/** POST /api/orders/:id/checkout → {url} */
export async function POST(request: Request, { params }: Ctx) {
  if (!assertOrderAccess(request, params.id)) {
    return unauthorizedOrderResponse();
  }
  return NextResponse.json({
    orderId: params.id,
    url: null,
    stub: true,
    note: "Creem checkout wired in D2; mock-pay path available later",
  });
}
