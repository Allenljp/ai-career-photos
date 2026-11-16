import { isFalConfigured } from "@/lib/env";
import { mockProvider } from "@/lib/providers/mock";
import type {
  ImageProvider,
  PreviewGenerateInput,
  PreviewGenerateResult,
} from "@/lib/providers/types";

/**
 * fal.ai provider shell.
 * Real flux-lora-fast-training + Flux inference needs FAL_KEY (D2).
 * Until then (and whenever FAL_KEY is missing) we run the mock studio
 * headshot treatment so previews never look like a watermarked selfie.
 */
export const falProvider: ImageProvider = {
  name: "fal",

  async generatePreview(
    input: PreviewGenerateInput,
  ): Promise<PreviewGenerateResult> {
    if (!isFalConfigured()) {
      const result = await mockProvider.generatePreview(input);
      return { ...result, provider: "fal-mock" };
    }

    // 假设: full LoRA train + infer is D2; with FAL_KEY present we still use
    // the studio-mock path until fal SDK + training queue is wired.
    const result = await mockProvider.generatePreview(input);
    return {
      ...result,
      provider: "fal",
      providerJobId: `fal-pending-${input.triggerWord}`,
    };
  },
};
