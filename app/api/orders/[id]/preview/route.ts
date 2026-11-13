import { NextResponse } from "next/server";
import { createJob, getOrder, listUploads } from "@/lib/db";
import { imageProviderName } from "@/lib/env";
import { track } from "@/lib/ls";
import { runJob } from "@/lib/pipeline/generate";
import {
  FREE_PREVIEW_CLAIMED,
  hasClaimedFreePreview,
} from "@/lib/rate-limit";
import { clientIpFromHeaders } from "@/lib/request";

type Ctx = { params: { id: string } };

/** POST /api/orders/:id/preview → {jobId} — 1 free preview per fingerprint */
export async function POST(request: Request, { params }: Ctx) {
  const order = await getOrder(params.id);
  if (!order) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  if (order.status === "preview_ready") {
    return NextResponse.json({
      orderId: order.id,
      jobId: null,
      status: order.status,
      previewUrl: order.preview_url,
      score: order.score,
    });
  }

  const ip = clientIpFromHeaders(request.headers);
  const claimed = await hasClaimedFreePreview({
    email: order.email,
    ip,
    fingerprint: order.fingerprint,
  });
  if (claimed.blocked) {
    return NextResponse.json(
      { error: FREE_PREVIEW_CLAIMED, code: "free_preview_claimed" },
      { status: 429 },
    );
  }

  const uploads = await listUploads(params.id);
  if (uploads.length < 8) {
    return NextResponse.json(
      { error: "Complete precheck with 8–10 photos first." },
      { status: 400 },
    );
  }

  const provider = imageProviderName();
  const job = await createJob({
    orderId: params.id,
    kind: "preview",
    provider,
  });

  await track("preview_queued", { jobId: job.id, provider }, params.id);

  // 假设: mock / local runs the job inline so demos don't need cron.
  // Cron /api/cron/tick still drains queued jobs for the real provider path.
  try {
    await runJob(job.id, ip);
  } catch (err) {
    const message = err instanceof Error ? err.message : "preview failed";
    return NextResponse.json(
      { orderId: params.id, jobId: job.id, error: message },
      { status: 500 },
    );
  }

  const refreshed = await getOrder(params.id);
  return NextResponse.json({
    orderId: params.id,
    jobId: job.id,
    status: refreshed?.status,
    previewUrl: refreshed?.preview_url,
    score: refreshed?.score,
  });
}
