import { NextResponse } from "next/server";
import { deleteOrder, getOrder, updateOrder } from "@/lib/db";
import { scoreExplanation } from "@/lib/pipeline/score";

type Ctx = { params: { id: string } };

/** GET /api/orders/:id → {status, previewUrl?, score?} */
export async function GET(_request: Request, { params }: Ctx) {
  const order = await getOrder(params.id);
  if (!order) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json({
    orderId: order.id,
    status: order.status,
    previewUrl: order.preview_url,
    score: order.score,
    bioTip: order.bio_tip,
    scoreExplanation:
      order.score != null ? scoreExplanation(order.score) : null,
    email: order.email,
    targetRole: order.target_role,
    style: order.style,
  });
}

/** PATCH /api/orders/:id — attach email (preview page) */
export async function PATCH(request: Request, { params }: Ctx) {
  const order = await getOrder(params.id);
  if (!order) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const body = await request.json().catch(() => ({}));
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
  const next = await updateOrder(params.id, {
    email: email ?? order.email,
  });
  return NextResponse.json({ orderId: next?.id, email: next?.email });
}

/** DELETE /api/orders/:id → 204 (GDPR) */
export async function DELETE(_request: Request, { params }: Ctx) {
  await deleteOrder(params.id);
  return new NextResponse(null, { status: 204 });
}
