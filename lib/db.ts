import { randomUUID } from "crypto";
import { isSupabaseConfigured } from "@/lib/env";
import { getMemoryStore } from "@/lib/store";
import type {
  Asset,
  EventRow,
  Job,
  JobKind,
  Order,
  OrderStatus,
  Upload,
} from "@/lib/types";

/**
 * Data access layer.
 * 假设: without SUPABASE_* we use in-memory store so local demo + `pnpm build` work.
 * Real Supabase client plugs in behind the same functions when secrets exist (D2+).
 */

function nowIso() {
  return new Date().toISOString();
}

export function getDbMode(): "memory" | "supabase" {
  return isSupabaseConfigured() ? "supabase" : "memory";
}

/** Reserved for D2 — throws clearly if someone forces supabase without client. */
export function getDb() {
  if (!isSupabaseConfigured()) {
    return { mode: "memory" as const };
  }
  // 假设: supabase-js not installed yet; memory path remains primary for D1.
  return { mode: "memory" as const, note: "supabase env set but D1 uses memory adapter" };
}

export async function createOrder(input: {
  email?: string | null;
  targetRole?: string;
  style?: string;
  fingerprint?: string | null;
  utm?: Record<string, unknown> | null;
}): Promise<Order> {
  const store = getMemoryStore();
  const order: Order = {
    id: randomUUID(),
    email: input.email?.trim().toLowerCase() || null,
    status: "created",
    amount_cents: 2900,
    currency: "USD",
    creem_order_id: null,
    target_role: input.targetRole || "Professional",
    style: input.style || "professional",
    fingerprint: input.fingerprint || null,
    utm: input.utm ?? null,
    created_at: nowIso(),
    paid_at: null,
    delivered_at: null,
    refunded_at: null,
    bio_tip: null,
    score: null,
    preview_url: null,
  };
  store.orders.set(order.id, order);
  return order;
}

export async function getOrder(id: string): Promise<Order | null> {
  return getMemoryStore().orders.get(id) ?? null;
}

export async function updateOrder(
  id: string,
  patch: Partial<Order>,
): Promise<Order | null> {
  const store = getMemoryStore();
  const existing = store.orders.get(id);
  if (!existing) return null;
  const next = { ...existing, ...patch, id: existing.id };
  store.orders.set(id, next);
  return next;
}

export async function deleteOrder(id: string): Promise<void> {
  const store = getMemoryStore();
  store.orders.delete(id);
  Array.from(store.uploads.entries()).forEach(([uid, u]) => {
    if (u.order_id === id) store.uploads.delete(uid);
  });
  Array.from(store.jobs.entries()).forEach(([jid, j]) => {
    if (j.order_id === id) store.jobs.delete(jid);
  });
  Array.from(store.assets.entries()).forEach(([aid, a]) => {
    if (a.order_id === id) store.assets.delete(aid);
  });
}

export async function createUpload(input: {
  orderId: string;
  r2Key: string;
  mime?: string | null;
  bytes?: number | null;
  faceCount?: number | null;
  qualityScore?: number | null;
}): Promise<Upload> {
  const store = getMemoryStore();
  const row: Upload = {
    id: randomUUID(),
    order_id: input.orderId,
    r2_key: input.r2Key,
    mime: input.mime ?? null,
    bytes: input.bytes ?? null,
    face_count: input.faceCount ?? null,
    quality_score: input.qualityScore ?? null,
    created_at: nowIso(),
  };
  store.uploads.set(row.id, row);
  return row;
}

export async function listUploads(orderId: string): Promise<Upload[]> {
  return Array.from(getMemoryStore().uploads.values()).filter(
    (u) => u.order_id === orderId,
  );
}

export async function updateUpload(
  id: string,
  patch: Partial<Upload>,
): Promise<void> {
  const store = getMemoryStore();
  const existing = store.uploads.get(id);
  if (!existing) return;
  store.uploads.set(id, { ...existing, ...patch, id: existing.id });
}

export async function createJob(input: {
  orderId: string;
  kind: JobKind;
  provider?: string | null;
}): Promise<Job> {
  const store = getMemoryStore();
  const job: Job = {
    id: randomUUID(),
    order_id: input.orderId,
    kind: input.kind,
    status: "queued",
    attempts: 0,
    provider: input.provider ?? null,
    provider_job_id: null,
    error: null,
    started_at: null,
    finished_at: null,
    created_at: nowIso(),
  };
  store.jobs.set(job.id, job);
  return job;
}

export async function getJob(id: string): Promise<Job | null> {
  return getMemoryStore().jobs.get(id) ?? null;
}

export async function updateJob(
  id: string,
  patch: Partial<Job>,
): Promise<Job | null> {
  const store = getMemoryStore();
  const existing = store.jobs.get(id);
  if (!existing) return null;
  const next = { ...existing, ...patch, id: existing.id };
  store.jobs.set(id, next);
  return next;
}

export async function listQueuedJobs(limit = 10): Promise<Job[]> {
  return Array.from(getMemoryStore().jobs.values())
    .filter((j) => j.status === "queued")
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .slice(0, limit);
}

export async function createAsset(input: {
  orderId: string;
  kind: "headshot" | "pdf";
  r2Key: string;
  width?: number | null;
  height?: number | null;
  faceSimilarity?: number | null;
  aestheticScore?: number | null;
}): Promise<Asset> {
  const store = getMemoryStore();
  const row: Asset = {
    id: randomUUID(),
    order_id: input.orderId,
    kind: input.kind,
    r2_key: input.r2Key,
    width: input.width ?? null,
    height: input.height ?? null,
    face_similarity: input.faceSimilarity ?? null,
    aesthetic_score: input.aestheticScore ?? null,
    selected: false,
    created_at: nowIso(),
  };
  store.assets.set(row.id, row);
  return row;
}

export async function listAssets(orderId: string): Promise<Asset[]> {
  return Array.from(getMemoryStore().assets.values()).filter(
    (a) => a.order_id === orderId,
  );
}

export async function insertEvent(
  name: string,
  meta?: Record<string, unknown> | null,
  orderId?: string | null,
): Promise<EventRow> {
  const store = getMemoryStore();
  const row: EventRow = {
    id: store.eventSeq++,
    order_id: orderId ?? null,
    name,
    meta: meta ?? null,
    created_at: nowIso(),
  };
  store.events.push(row);
  return row;
}

export async function setOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order | null> {
  return updateOrder(id, { status });
}
