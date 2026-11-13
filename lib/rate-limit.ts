/** Free-tier rate limits (email / IP / fingerprint) — wired in D1 */
export async function checkFreePreviewLimit(key: string): Promise<boolean> {
  void key;
  throw new Error("rate-limit not configured (D1)");
}
