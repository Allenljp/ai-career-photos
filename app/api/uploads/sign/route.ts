import { NextResponse } from "next/server";
import {
  assertOrderAccess,
  unauthorizedOrderResponse,
} from "@/lib/auth";
import { getOrder } from "@/lib/db";
import { signUploadUrls } from "@/lib/r2";

/** POST /api/uploads/sign — {count, orderId} → {keys[], uploadUrls[]} (order-bound + signed) */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const orderId = typeof body?.orderId === "string" ? body.orderId : "";
  const count = Number(body?.count ?? 0);

  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }
  if (!assertOrderAccess(request, orderId)) {
    return unauthorizedOrderResponse();
  }
  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (!Number.isFinite(count) || count < 1 || count > 10) {
    return NextResponse.json(
      { error: "count must be between 1 and 10" },
      { status: 400 },
    );
  }

  const signed = await signUploadUrls(count, orderId);
  return NextResponse.json(signed);
}
