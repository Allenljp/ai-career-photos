"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getOrCreateFingerprint,
  trackClient,
} from "@/lib/track-client";

const ROLES = [
  "Professional",
  "Software Engineer",
  "Product Manager",
  "Marketing",
  "Sales",
  "Designer",
  "Finance",
  "Student / New grad",
  "Other",
];

type PrecheckFile = {
  key: string;
  ok: boolean;
  reason?: string;
};

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [role, setRole] = useState("Professional");
  const [consent, setConsent] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [precheck, setPrecheck] = useState<PrecheckFile[] | null>(null);

  useEffect(() => {
    trackClient("start_upload");
  }, []);

  const count = files.length;
  const needed = Math.max(0, 8 - count);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canContinue =
    count >= 8 && count <= 10 && consent && emailOk && !busy;

  const hint = useMemo(() => {
    if (count === 0) return "0 of 8 photos";
    if (count < 8)
      return `Add ${needed} more photo${needed === 1 ? "" : "s"} to continue.`;
    if (count > 10) return "Remove extras — max 10 photos.";
    return `${count} photos ready`;
  }, [count, needed]);

  function onPick(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    for (const f of incoming) {
      if (f.size > 20 * 1024 * 1024) {
        setError("Each photo must be under 20 MB.");
        return;
      }
      const okType =
        /image\/(jpeg|png|heic|heif)/i.test(f.type) ||
        /\.(jpe?g|png|heic|heif)$/i.test(f.name);
      if (!okType) {
        setError("That file type isn't supported. Use JPG, PNG or HEIC.");
        return;
      }
    }
    setError(null);
    setPrecheck(null);
    const next = [...files, ...incoming].slice(0, 10);
    setFiles(next);
  }

  function removeAt(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPrecheck(null);
  }

  async function onContinue() {
    if (!canContinue) return;
    setBusy(true);
    setError(null);
    setPrecheck(null);

    try {
      const fingerprint = getOrCreateFingerprint();

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          targetRole: role,
          style: "professional",
          fingerprint,
        }),
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(
          orderJson?.error || "Could not create order. Try again.",
        );
      }
      const orderId = orderJson.orderId as string;

      const signRes = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: files.length }),
      });
      const signed = await signRes.json();
      if (!signRes.ok) {
        throw new Error(signed?.error || "Could not prepare upload.");
      }

      const keys: string[] = signed.keys;
      const uploadUrls: string[] = signed.uploadUrls;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = uploadUrls[i];
        const put = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        });
        if (!put.ok) {
          const msg = await put.json().catch(() => ({}));
          throw new Error(
            msg?.error || `Upload failed for photo ${i + 1}. Try again.`,
          );
        }
      }

      trackClient("upload_complete", { count: files.length }, orderId);

      const preRes = await fetch(`/api/orders/${orderId}/precheck`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys }),
      });
      const preJson = await preRes.json();
      if (!preRes.ok) {
        throw new Error(preJson?.error || "Precheck failed.");
      }

      const perFile: PrecheckFile[] = (preJson.perFile || []).map(
        (f: PrecheckFile, idx: number) => ({
          ...f,
          reason: f.ok
            ? undefined
            : humanizePrecheckReason(f.reason, idx + 1),
        }),
      );
      setPrecheck(perFile);

      if (!preJson.ok) {
        setError(
          perFile.find((f) => !f.ok)?.reason ||
            "Some photos need to be replaced.",
        );
        setBusy(false);
        return;
      }

      const previewRes = await fetch(`/api/orders/${orderId}/preview`, {
        method: "POST",
      });
      const previewJson = await previewRes.json();
      if (!previewRes.ok) {
        throw new Error(
          previewJson?.error || "Could not start free preview.",
        );
      }

      router.push(`/preview/${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Upload 8–10 photos
      </h1>
      <p className="mt-2 text-muted">
        We&apos;ll check each photo for a clear, single face — then queue your free
        preview.
      </p>

      <div className="mt-8 rounded-2xl border border-soft bg-surface p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Photo tips
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-ink">
          <li>Face the camera — front-facing works best</li>
          <li>Good light (daylight preferred)</li>
          <li>No sunglasses or heavy filters</li>
        </ul>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-success/30 bg-white p-3 text-center text-xs text-success">
            Good example (placeholder)
          </div>
          <div className="rounded-xl border border-danger/30 bg-white p-3 text-center text-xs text-danger">
            Avoid this (placeholder)
          </div>
        </div>
      </div>

      <label
        htmlFor="photo-input"
        className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-soft bg-white px-4 py-12 text-center hover:border-accent/40"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onPick(e.dataTransfer.files);
        }}
      >
        <span className="text-base font-medium text-ink">
          Drag photos here, or browse
        </span>
        <span className="mt-2 text-sm text-muted">
          JPG, PNG, or HEIC · under 20 MB each · camera OK on mobile
        </span>
        <input
          id="photo-input"
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif"
          multiple
          capture="user"
          className="sr-only"
          onChange={(e) => onPick(e.target.files)}
        />
      </label>

      <p className="mt-4 text-sm text-muted">{hint}</p>

      {files.length > 0 ? (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {files.map((file, i) => {
            const check = precheck?.[i];
            return (
              <li
                key={`${file.name}-${file.size}-${i}`}
                className="flex flex-col gap-1 rounded-xl border border-soft bg-surface px-3 py-2 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-ink">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="shrink-0 text-muted hover:text-danger"
                  >
                    Remove
                  </button>
                </div>
                {check ? (
                  <span
                    className={
                      check.ok ? "text-xs text-success" : "text-xs text-danger"
                    }
                  >
                    {check.ok ? "✔ Clear face" : `✖ ${check.reason || "Failed"}`}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="mt-8">
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Email (required for free preview)
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="mt-2 h-12 w-full rounded-xl border border-soft bg-white px-3 text-ink"
        />
      </div>

      <div className="mt-6">
        <label htmlFor="role" className="block text-sm font-medium text-ink">
          Target role
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-2 h-12 w-full rounded-xl border border-soft bg-white px-3 text-ink"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-ink">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-soft"
        />
        <span>I confirm these are photos of me and I am 18 or older.</span>
      </label>

      {error ? (
        <p className="mt-4 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={!canContinue}
        className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-accent text-base font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        onClick={onContinue}
      >
        {busy ? "Checking photos…" : "Continue to free preview"}
      </button>
      <p className="mt-3 text-center text-sm text-muted">
        Photos are deleted in 7 days. Never used for training.
      </p>
    </div>
  );
}

function humanizePrecheckReason(reason: string | undefined, index: number) {
  if (!reason) return `Photo ${index} failed precheck.`;
  if (/clear face/i.test(reason)) {
    return `We couldn't find a clear face in photo ${index}. Try a front-facing photo in good light.`;
  }
  if (/more than one face/i.test(reason)) {
    return `Photo ${index} has more than one face. Upload a solo photo.`;
  }
  return reason.includes("photo") ? reason : `Photo ${index}: ${reason}`;
}
