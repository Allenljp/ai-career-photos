"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackClient } from "@/lib/track-client";

type OrderPayload = {
  orderId: string;
  status: string;
  previewUrl: string | null;
  score: number | null;
  bioTip: string | null;
  scoreExplanation: string | null;
  email: string | null;
  targetRole?: string;
};

export default function PreviewPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;
  const [order, setOrder] = useState<OrderPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trackedReady, setTrackedReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function load() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error || "Order not found");
        }
        if (cancelled) return;
        setOrder(json);
        setError(null);

        if (json.status === "preview_ready" || json.status === "failed") {
          return;
        }
        timer = setTimeout(load, 1500);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderId]);

  useEffect(() => {
    if (order?.status === "preview_ready" && !trackedReady) {
      trackClient(
        "preview_ready",
        { score: order.score },
        order.orderId,
      );
      setTrackedReady(true);
    }
  }, [order, trackedReady]);

  const score = order?.score;
  const showUnlock = score == null || score >= 60;
  const loading =
    !error &&
    (!order ||
      (order.status !== "preview_ready" && order.status !== "failed"));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Your free preview
      </h1>
      <p className="mt-2 text-sm text-muted">Order {orderId}</p>

      {error ? (
        <p className="mt-8 text-sm text-danger" role="alert">
          {error}{" "}
          <Link href="/upload" className="underline">
            Re-upload
          </Link>
        </p>
      ) : null}

      {loading ? (
        <p className="mt-10 text-sm text-muted">
          Generating your watermarked preview… usually under a minute in demo
          mode.
        </p>
      ) : null}

      {order?.status === "failed" ? (
        <p className="mt-8 text-sm text-danger">
          We couldn&apos;t generate a preview.{" "}
          <Link href="/upload" className="underline">
            Re-upload
          </Link>
        </p>
      ) : null}

      {order?.status === "preview_ready" ? (
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-soft bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={order.previewUrl || ""}
              alt="Watermarked free preview"
              width={512}
              height={512}
              className="aspect-square w-full object-cover"
              draggable={false}
            />
            <p className="px-3 py-2 text-center text-xs text-muted">
              Preview 512px · watermarked
            </p>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-muted">
              Likeness score
            </p>
            <p className="mt-2 text-5xl font-semibold text-ink">
              {score ?? "—"}
            </p>
            <p className="mt-3 text-sm text-muted">
              {order.scoreExplanation}
            </p>

            {order.bioTip ? (
              <p className="mt-4 rounded-xl border border-soft bg-white p-4 text-sm text-ink">
                <span className="font-medium">Bio tip: </span>
                {order.bioTip}
              </p>
            ) : null}

            <div className="mt-6 text-sm text-muted">
              <p className="font-medium text-ink">What your score means</p>
              <ul className="mt-2 space-y-1">
                <li>80+ Good</li>
                <li>60–79 Fair</li>
                <li>&lt;60 Retry</li>
              </ul>
            </div>

            {showUnlock ? (
              <div className="mt-8 rounded-2xl border border-accent/30 bg-white p-6 shadow-soft">
                <h2 className="text-lg font-semibold text-ink">
                  Unlock my headshots
                </h2>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  $29{" "}
                  <span className="text-base font-normal text-muted">once</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  <li>40 headshots in 4K</li>
                  <li>Choose 4 to download</li>
                  <li>Role-specific bio pack (PDF)</li>
                  <li>1 free redo if generation fails</li>
                </ul>
                {order.email ? (
                  <p className="mt-4 text-xs text-muted">
                    We&apos;ll send unlock updates to {order.email}
                  </p>
                ) : null}
                <button
                  type="button"
                  className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-accent text-white hover:bg-accent-hover"
                  onClick={() => {
                    trackClient("click_unlock", {}, orderId);
                    // D2: Creem / mock-pay
                    window.alert(
                      "Checkout is stubbed for D2. Free preview loop is live.",
                    );
                  }}
                >
                  Unlock my headshots
                </button>
                <p className="mt-3 text-xs text-muted">
                  Secure checkout by Creem.
                </p>
              </div>
            ) : (
              <p className="mt-8 text-sm text-muted">
                Score is below 60 —{" "}
                <Link href="/upload" className="text-accent underline">
                  retake a few photos
                </Link>{" "}
                for a better match.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
