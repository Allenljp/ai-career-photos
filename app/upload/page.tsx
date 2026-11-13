"use client";

import { useMemo, useState } from "react";

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

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [role, setRole] = useState("Professional");
  const [consent, setConsent] = useState(false);

  const count = files.length;
  const needed = Math.max(0, 8 - count);
  const canContinue = count >= 8 && count <= 10 && consent;

  const hint = useMemo(() => {
    if (count === 0) return "0 of 8 photos";
    if (count < 8)
      return `Add ${needed} more photo${needed === 1 ? "" : "s"} to continue.`;
    if (count > 10) return "Remove extras — max 10 photos.";
    return `${count} photos ready`;
  }, [count, needed]);

  function onPick(list: FileList | null) {
    if (!list) return;
    const next = [...files, ...Array.from(list)].slice(0, 10);
    setFiles(next);
  }

  function removeAt(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
          {files.map((file, i) => (
            <li
              key={`${file.name}-${file.size}-${i}`}
              className="flex items-center justify-between gap-2 rounded-xl border border-soft bg-surface px-3 py-2 text-sm"
            >
              <span className="truncate text-ink">{file.name}</span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="shrink-0 text-muted hover:text-danger"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-8">
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

      <button
        type="button"
        disabled={!canContinue}
        className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-accent text-base font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => {
          // D0 shell only — wire to /api/orders + precheck in D1
          window.alert(
            "Upload shell ready. D1 will connect signing, precheck, and preview.",
          );
        }}
      >
        Continue to free preview
      </button>
      <p className="mt-3 text-center text-sm text-muted">
        Photos are deleted in 7 days. Never used for training.
      </p>
    </div>
  );
}
