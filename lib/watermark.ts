import sharp from "sharp";

/**
 * Resize to 512px square-ish and burn a translucent PREVIEW mark bottom-right.
 * Build doc §8: 512px + semi-transparent logo + "PREVIEW".
 */
export async function applyWatermark(input: Buffer): Promise<Buffer> {
  const size = 512;
  const base = await sharp(input)
    .rotate()
    .resize(size, size, { fit: "cover", position: "attention" })
    .png()
    .toBuffer();

  const overlaySvg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0e6b66" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#0a3d3a" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <rect x="${size - 168}" y="${size - 56}" width="152" height="40" rx="8" fill="url(#g)"/>
      <text x="${size - 92}" y="${size - 30}" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700"
        fill="white" fill-opacity="0.92" letter-spacing="1.5">PREVIEW</text>
      <text x="${size - 92}" y="${size - 14}" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif" font-size="8"
        fill="white" fill-opacity="0.75">AI Career Headshots</text>
    </svg>
  `;

  return sharp(base)
    .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
    .jpeg({ quality: 82 })
    .toBuffer();
}
