import { NextResponse } from "next/server";
import {
  assertOrderAccess,
  unauthorizedOrderResponse,
} from "@/lib/auth";

type Ctx = { params: { id: string } };

/** GET /api/orders/:id/assets → {assets[]} */
export async function GET(request: Request, { params }: Ctx) {
  if (!assertOrderAccess(request, params.id)) {
    return unauthorizedOrderResponse();
  }
  return NextResponse.json({
    orderId: params.id,
    assets: [],
    stub: true,
  });
}
