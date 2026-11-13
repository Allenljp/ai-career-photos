export type OrderStatus =
  | "created"
  | "preview_ready"
  | "paid"
  | "generating"
  | "ready"
  | "delivered"
  | "refunded"
  | "failed";

export type JobKind = "preview" | "full";
export type JobStatus = "queued" | "running" | "succeeded" | "failed";

export type Order = {
  id: string;
  email: string | null;
  status: OrderStatus;
  amount_cents: number;
  currency: string;
  creem_order_id: string | null;
  target_role: string;
  style: string;
  fingerprint: string | null;
  utm: Record<string, unknown> | null;
  created_at: string;
  paid_at: string | null;
  delivered_at: string | null;
  refunded_at: string | null;
  /** D1: likeness tip for free preview */
  bio_tip: string | null;
  score: number | null;
  preview_url: string | null;
};

export type Upload = {
  id: string;
  order_id: string;
  r2_key: string;
  mime: string | null;
  bytes: number | null;
  face_count: number | null;
  quality_score: number | null;
  created_at: string;
};

export type Job = {
  id: string;
  order_id: string;
  kind: JobKind;
  status: JobStatus;
  attempts: number;
  provider: string | null;
  provider_job_id: string | null;
  error: string | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
};

export type Asset = {
  id: string;
  order_id: string;
  kind: "headshot" | "pdf";
  r2_key: string;
  width: number | null;
  height: number | null;
  face_similarity: number | null;
  aesthetic_score: number | null;
  selected: boolean;
  created_at: string;
};

export type EventRow = {
  id: number;
  order_id: string | null;
  name: string;
  meta: Record<string, unknown> | null;
  created_at: string;
};

export type RateLimitRow = {
  key: string;
  window_start: string;
  count: number;
};

export type PrecheckFileResult = {
  key: string;
  ok: boolean;
  reason?: string;
  faceCount?: number;
  qualityScore?: number;
};
