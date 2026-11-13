import {
  createAsset,
  getJob,
  getOrder,
  listUploads,
  updateJob,
  updateOrder,
} from "@/lib/db";
import { insertEvent } from "@/lib/db";
import { getObject, publicUrlForKey, putObject } from "@/lib/r2";
import { getImageProvider } from "@/lib/providers";
import { bioTipForRole, scorePreview } from "@/lib/pipeline/score";
import { claimFreePreview } from "@/lib/rate-limit";
import { applyWatermark } from "@/lib/watermark";

/**
 * Run a queued job. Preview path: provider → watermark → score → order ready.
 */
export async function generateHeadshots(
  orderId: string,
  kind: "preview" | "full",
  jobId?: string,
  claimIp?: string | null,
) {
  if (kind === "full") {
    throw new Error("full generation is D2");
  }

  const order = await getOrder(orderId);
  if (!order) throw new Error("order not found");

  if (jobId) {
    await updateJob(jobId, {
      status: "running",
      started_at: new Date().toISOString(),
      attempts: ((await getJob(jobId))?.attempts ?? 0) + 1,
    });
  }

  try {
    const uploads = await listUploads(orderId);
    const buffers: Buffer[] = [];
    for (const u of uploads) {
      const buf = await getObject(u.r2_key);
      if (buf) buffers.push(buf);
    }
    if (buffers.length === 0) {
      throw new Error("No uploaded images found for preview");
    }

    const provider = getImageProvider();
    const triggerWord = `ohwx${orderId.replace(/-/g, "").slice(0, 8)}`;
    const generated = await provider.generatePreview({
      orderId,
      sourceImages: buffers,
      triggerWord,
    });

    const watermarked = await applyWatermark(generated.image);
    const previewKey = `previews/${orderId}/preview-512.jpg`;
    await putObject(previewKey, watermarked, "image/jpeg");

    const score = scorePreview(generated.similarity, generated.sharpness);
    const previewUrl = publicUrlForKey(previewKey);
    const tip = bioTipForRole(order.target_role);

    await createAsset({
      orderId,
      kind: "headshot",
      r2Key: previewKey,
      width: 512,
      height: 512,
      faceSimilarity: generated.similarity,
      aestheticScore: generated.sharpness,
    });

    await updateOrder(orderId, {
      status: "preview_ready",
      preview_url: previewUrl,
      score,
      bio_tip: tip,
    });

    await claimFreePreview({
      email: order.email,
      fingerprint: order.fingerprint,
      ip: claimIp ?? null,
    });

    await insertEvent(
      "preview_ready",
      { score, provider: generated.provider },
      orderId,
    );

    if (jobId) {
      await updateJob(jobId, {
        status: "succeeded",
        provider: generated.provider,
        provider_job_id: generated.providerJobId ?? null,
        finished_at: new Date().toISOString(),
        error: null,
      });
    }

    return { previewUrl, score, jobId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "preview failed";
    if (jobId) {
      const job = await getJob(jobId);
      const attempts = job?.attempts ?? 1;
      if (attempts < 2) {
        await updateJob(jobId, {
          status: "queued",
          error: message,
        });
      } else {
        await updateJob(jobId, {
          status: "failed",
          error: message,
          finished_at: new Date().toISOString(),
        });
        await updateOrder(orderId, { status: "failed" });
      }
    }
    throw err;
  }
}

/** Process one job by id (cron / inline). */
export async function runJob(jobId: string, claimIp?: string | null) {
  const job = await getJob(jobId);
  if (!job) throw new Error("job not found");
  if (job.status !== "queued" && job.status !== "running") {
    return { skipped: true };
  }
  return generateHeadshots(job.order_id, job.kind, job.id, claimIp);
}
