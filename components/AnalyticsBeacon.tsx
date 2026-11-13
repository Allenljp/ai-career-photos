"use client";

import { useEffect } from "react";
import { trackClient } from "@/lib/track-client";

/** Fire a single analytics event on mount (no UI). */
export function AnalyticsBeacon({
  name,
  meta,
}: {
  name: string;
  meta?: Record<string, unknown>;
}) {
  useEffect(() => {
    trackClient(name, meta);
  }, [name, meta]);
  return null;
}
