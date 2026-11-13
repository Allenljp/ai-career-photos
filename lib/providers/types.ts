export type PreviewGenerateInput = {
  orderId: string;
  /** Local/mock source image buffers (already uploaded) */
  sourceImages: Buffer[];
  triggerWord: string;
};

export type PreviewGenerateResult = {
  image: Buffer;
  provider: string;
  providerJobId?: string;
  /** 0–1 ArcFace-like similarity (mock or real) */
  similarity: number;
  /** 0–1 sharpness proxy */
  sharpness: number;
};

export type ImageProvider = {
  name: string;
  generatePreview(input: PreviewGenerateInput): Promise<PreviewGenerateResult>;
};
