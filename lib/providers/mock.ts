import sharp from "sharp";
import type { ImageProvider, PreviewGenerateInput, PreviewGenerateResult } from "@/lib/providers/types";

/**
 * Local mock provider — uses the first upload as the "generated" headshot.
 * Keeps demos working without FAL_KEY.
 */
export const mockProvider: ImageProvider = {
  name: "mock",

  async generatePreview(
    input: PreviewGenerateInput,
  ): Promise<PreviewGenerateResult> {
    const source = input.sourceImages[0];
    if (!source) {
      throw new Error("No source images for mock preview");
    }

    // Mild studio-ish grade so preview feels distinct from the raw upload.
    const image = await sharp(source)
      .rotate()
      .resize(1024, 1024, { fit: "cover", position: "attention" })
      .modulate({ brightness: 1.04, saturation: 0.92 })
      .sharpen()
      .jpeg({ quality: 90 })
      .toBuffer();

    // Deterministic-ish mock scores from order id
    const seed = hash(input.orderId);
    const similarity = 0.72 + (seed % 20) / 100; // 0.72–0.91
    const sharpness = 0.65 + ((seed >> 3) % 25) / 100; // 0.65–0.89

    return {
      image,
      provider: "mock",
      providerJobId: `mock-${input.orderId.slice(0, 8)}`,
      similarity: Math.min(0.95, similarity),
      sharpness: Math.min(0.95, sharpness),
    };
  },
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
