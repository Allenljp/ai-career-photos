/**
 * Per-user LoRA training via fal flux-lora-fast-training.
 * Wired for real FAL_KEY in D2; D1 preview uses mock/single-image path.
 */
export async function trainLora(orderId: string) {
  void orderId;
  return {
    status: "skipped" as const,
    note: "LoRA training deferred to D2 when FAL_KEY is live",
  };
}
