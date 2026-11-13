/** Preview watermark (512px + PREVIEW mark) — wired in D1 */
export async function applyWatermark(input: unknown): Promise<never> {
  void input;
  throw new Error("watermark not configured (D1)");
}
