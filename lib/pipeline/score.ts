/** Likeness + sharpness scoring — wired in D1 */
export function scorePreview(_similarity: number, _sharpness: number): number {
  return Math.round(_similarity * 70 + _sharpness * 30);
}
