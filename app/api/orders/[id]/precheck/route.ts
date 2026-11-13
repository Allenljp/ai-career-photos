import { NextResponse } from "next/server";
import {
  createUpload,
  getOrder,
  listUploads,
  updateUpload,
} from "@/lib/db";
import { track } from "@/lib/ls";
import { precheckUploads } from "@/lib/pipeline/precheck";
import { getObject } from "@/lib/r2";

type Ctx = { params: { id: string } };

/** POST /api/orders/:id/precheck — {keys[]} → {ok, perFile[]} */
export async function POST(request: Request, { params }: Ctx) {
  const order = await getOrder(params.id);
  if (!order) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const keys: string[] = Array.isArray(body?.keys) ? body.keys : [];
  if (keys.length < 8 || keys.length > 10) {
    return NextResponse.json(
      { error: "Upload 8–10 photos for precheck." },
      { status: 400 },
    );
  }

  const result = await precheckUploads(keys);

  // Persist upload rows (create or refresh)
  const existing = await listUploads(params.id);
  for (const file of result.perFile) {
    const buf = await getObject(file.key);
    const found = existing.find((u) => u.r2_key === file.key);
    if (found) {
      await updateUpload(found.id, {
        face_count: file.faceCount ?? null,
        quality_score: file.qualityScore ?? null,
        bytes: buf?.byteLength ?? found.bytes,
      });
    } else {
      await createUpload({
        orderId: params.id,
        r2Key: file.key,
        bytes: buf?.byteLength ?? null,
        faceCount: file.faceCount ?? null,
        qualityScore: file.qualityScore ?? null,
        mime: null,
      });
    }
  }

  await track(
    result.ok ? "precheck_pass" : "precheck_fail",
    { fileCount: keys.length },
    params.id,
  );

  return NextResponse.json({
    orderId: params.id,
    ok: result.ok,
    perFile: result.perFile,
  });
}
