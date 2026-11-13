import { imageProviderName } from "@/lib/env";
import { falProvider } from "@/lib/providers/fal";
import { mockProvider } from "@/lib/providers/mock";
import { replicateProvider } from "@/lib/providers/replicate";
import type { ImageProvider } from "@/lib/providers/types";

export function getImageProvider(): ImageProvider {
  const name = imageProviderName();
  if (name === "replicate") return replicateProvider;
  if (name === "fal") return falProvider;
  return mockProvider;
}

export type { ImageProvider } from "@/lib/providers/types";
