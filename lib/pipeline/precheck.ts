import sharp from "sharp";
import { getObject } from "@/lib/r2";
import type { PrecheckFileResult } from "@/lib/types";

/**
 * Face / blur / resolution precheck.
 * 假设 (D1 mock): without a face-detection service we validate the image
 * decodes, has reasonable dimensions, and assign face_count=1 + a sharpness
 * proxy from Laplacian-ish variance via sharp stats / edge energy.
 * Real MediaPipe / InsightFace plugs in behind this function later.
 */
export async function precheckUploads(
  keys: string[],
): Promise<{ ok: boolean; perFile: PrecheckFileResult[] }> {
  const perFile: PrecheckFileResult[] = [];

  for (const key of keys) {
    const buf = await getObject(key);
    if (!buf) {
      perFile.push({
        key,
        ok: false,
        reason: "Upload missing — please re-upload this photo.",
      });
      continue;
    }

    try {
      const img = sharp(buf, { failOn: "none" });
      const meta = await img.metadata();
      const w = meta.width ?? 0;
      const h = meta.height ?? 0;
      const shortSide = Math.min(w, h);

      if (w < 64 || h < 64) {
        perFile.push({
          key,
          ok: false,
          reason: "Image is too small. Use a clearer photo.",
        });
        continue;
      }

      // Production wants short side ≥1024; mock accepts ≥256 so local demos work.
      const dimsOk = shortSide >= 256;
      const stats = await sharp(buf)
        .greyscale()
        .resize(256, 256, { fit: "inside" })
        .raw()
        .toBuffer({ resolveWithObject: true });

      const sharpness = estimateSharpness(stats.data);
      const qualityScore = Math.round(sharpness * 100) / 100;

      // 假设: mock always reports a single face when the image looks usable.
      const faceCount = 1;
      const blurFail = sharpness < 0.12;

      if (!dimsOk) {
        perFile.push({
          key,
          ok: false,
          reason: "Resolution too low. Prefer short side ≥1024px.",
          faceCount,
          qualityScore,
        });
        continue;
      }

      if (blurFail) {
        perFile.push({
          key,
          ok: false,
          reason:
            "We couldn't find a clear face — try a front-facing photo in good light.",
          faceCount,
          qualityScore,
        });
        continue;
      }

      perFile.push({
        key,
        ok: true,
        faceCount,
        qualityScore,
      });
    } catch {
      perFile.push({
        key,
        ok: false,
        reason: "That file type isn't supported. Use JPG, PNG or HEIC.",
      });
    }
  }

  const ok = perFile.length > 0 && perFile.every((f) => f.ok);
  return { ok, perFile };
}

/** Cheap sharpness proxy 0–1 from greyscale pixel variance. */
function estimateSharpness(data: Buffer): number {
  if (data.length < 2) return 0;
  let sum = 0;
  let sumSq = 0;
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    sum += v;
    sumSq += v * v;
  }
  const n = data.length;
  const mean = sum / n;
  const variance = sumSq / n - mean * mean;
  // Map typical photo variance into 0–1
  return Math.min(1, Math.max(0, variance / 2500));
}
