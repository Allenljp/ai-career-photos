import { NextResponse } from "next/server";
import {
  assertOrderAccess,
  unauthorizedOrderResponse,
} from "@/lib/auth";

type Ctx = { params: { id: string } };

/** POST /api/orders/:id/select — {assetIds[4]} → {ok} */
export async function POST(request: Request, { params }: Ctx) {
  if (!assertOrderAccess(request, params.id)) {
    return unauthorizedOrderResponse();
  }
  await request.json().catch(() => ({}));

  return NextResponse.json({
    orderId: params.id,
    ok: false,
    stub: true,
  });
}
