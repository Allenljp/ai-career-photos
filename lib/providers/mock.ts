import sharp from "sharp";
import type {
  ImageProvider,
  PreviewGenerateInput,
  PreviewGenerateResult,
} from "@/lib/providers/types";

const OUT = 1024;

/**
 * Local mock provider — applies a studio headshot treatment to the upload
 * (face-centered crop + neutral backdrop composite) so free preview never
 * ships a watermarked raw selfie. Used when FAL_KEY is absent.
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

    const image = await studioHeadshotFromSelfie(source);

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

/**
 * Mock studio treatment: attention face crop → soft oval subject cutout →
 * neutral studio backdrop → light grade. Visually distinct from a raw selfie.
 */
export async function studioHeadshotFromSelfie(
  source: Buffer,
): Promise<Buffer> {
  // Soft neutral studio wall (LinkedIn-style gray).
  const backdrop = await sharp(
    Buffer.from(`
      <svg width="${OUT}" height="${OUT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg" cx="50%" cy="36%" r="72%">
            <stop offset="0%" stop-color="#dde1e6"/>
            <stop offset="52%" stop-color="#b9c0c9"/>
            <stop offset="100%" stop-color="#8a929c"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
      </svg>
    `),
  )
    .png()
    .toBuffer();

  // Square face-biased crop first (attention), then slight upward bias so
  // head+shoulders dominate — closer to a real studio headshot frame.
  const faceSquare = await sharp(source)
    .rotate()
    .resize(OUT, OUT, { fit: "cover", position: "attention" })
    .modulate({ brightness: 1.06, saturation: 0.84 })
    .sharpen({ sigma: 0.65 })
    .png()
    .toBuffer();

  // Tighten to head-and-shoulders: keep upper ~78% of the attention square.
  const subjectW = Math.round(OUT * 0.7);
  const subjectH = Math.round(OUT * 0.86);
  const subject = await sharp(faceSquare)
    .extract({
      left: Math.round((OUT - subjectW) / 2),
      top: Math.round(OUT * 0.04),
      width: subjectW,
      height: subjectH,
    })
    .ensureAlpha()
    .png()
    .toBuffer();

  // Aggressive soft oval — drops most of the original room background.
  const mask = await sharp(
    Buffer.from(`
      <svg width="${subjectW}" height="${subjectH}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="m" cx="50%" cy="40%" fx="50%" fy="38%" r="48%">
            <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
            <stop offset="62%" stop-color="#fff" stop-opacity="1"/>
            <stop offset="82%" stop-color="#fff" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#m)"/>
      </svg>
    `),
  )
    .png()
    .toBuffer();

  const maskedSubject = await sharp(subject)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const left = Math.round((OUT - subjectW) / 2);
  const top = Math.round((OUT - subjectH) / 2) + 28;

  // Soft key light + floor vignette for a studio finish.
  const grade = await sharp(
    Buffer.from(`
      <svg width="${OUT}" height="${OUT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="light" cx="40%" cy="26%" r="52%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
            <stop offset="70%" stop-color="#000" stop-opacity="0"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0.28"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#light)"/>
        <rect width="100%" height="100%" fill="url(#vignette)"/>
      </svg>
    `),
  )
    .png()
    .toBuffer();

  return sharp(backdrop)
    .composite([
      { input: maskedSubject, left, top },
      { input: grade, blend: "over" },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
