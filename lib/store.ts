import type {
  Asset,
  EventRow,
  Job,
  Order,
  RateLimitRow,
  Upload,
} from "@/lib/types";

/**
 * Process-local store used when Supabase is not configured.
 * Survives Next.js hot reload via globalThis.
 */
type MemoryStore = {
  orders: Map<string, Order>;
  uploads: Map<string, Upload>;
  jobs: Map<string, Job>;
  assets: Map<string, Asset>;
  events: EventRow[];
  rateLimits: Map<string, RateLimitRow>;
  /** key → absolute file path or buffer marker */
  files: Map<string, Buffer>;
  /** orderId → access token (proof of ownership) */
  orderTokens: Map<string, string>;
  eventSeq: number;
};

const g = globalThis as unknown as { __aiCareerStore?: MemoryStore };

export function getMemoryStore(): MemoryStore {
  if (!g.__aiCareerStore) {
    g.__aiCareerStore = {
      orders: new Map(),
      uploads: new Map(),
      jobs: new Map(),
      assets: new Map(),
      events: [],
      rateLimits: new Map(),
      files: new Map(),
      orderTokens: new Map(),
      eventSeq: 1,
    };
  }
  // Hot-reload safety for stores created before orderTokens existed.
  if (!g.__aiCareerStore.orderTokens) {
    g.__aiCareerStore.orderTokens = new Map();
  }
  return g.__aiCareerStore;
}
