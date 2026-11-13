import { mockProvider } from "@/lib/providers/mock";
import type {
  ImageProvider,
  PreviewGenerateInput,
  PreviewGenerateResult,
} from "@/lib/providers/types";

/** Replicate InstantID backup — structure only until REPLICATE_API_TOKEN (D2). */
export const replicateProvider: ImageProvider = {
  name: "replicate",

  async generatePreview(
    input: PreviewGenerateInput,
  ): Promise<PreviewGenerateResult> {
    if (!process.env.REPLICATE_API_TOKEN) {
      const result = await mockProvider.generatePreview(input);
      return { ...result, provider: "replicate-mock" };
    }
    const result = await mockProvider.generatePreview(input);
    return {
      ...result,
      provider: "replicate",
      providerJobId: `replicate-pending-${input.triggerWord}`,
    };
  },
};
