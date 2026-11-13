/** Feature flags from env — never throw for missing secrets in D1 mock mode. */

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function isR2Configured() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET,
  );
}

export function isFalConfigured() {
  return Boolean(process.env.FAL_KEY);
}

export function imageProviderName(): "fal" | "replicate" | "mock" {
  if (process.env.IMAGE_PROVIDER === "replicate") return "replicate";
  if (isFalConfigured() && process.env.IMAGE_PROVIDER !== "mock") return "fal";
  return "mock";
}

export function faceSimThreshold() {
  const n = Number(process.env.FACE_SIM_THRESHOLD ?? 0.55);
  return Number.isFinite(n) ? n : 0.55;
}

export function storageMode(): "r2" | "mock" {
  return isR2Configured() ? "r2" : "mock";
}
