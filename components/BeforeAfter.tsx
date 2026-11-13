type Pair = {
  label: string;
};

const PAIRS: Pair[] = [
  { label: "Marketing" },
  { label: "Engineering" },
  { label: "Student" },
];

export function BeforeAfter() {
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
      {PAIRS.map((pair) => (
        <figure
          key={pair.label}
          className="min-w-[260px] shrink-0 overflow-hidden rounded-2xl border border-soft bg-white shadow-soft sm:min-w-0"
        >
          <div className="grid grid-cols-2">
            <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-200 to-slate-300">
              <span className="absolute left-2 top-2 rounded bg-black/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                Before — phone selfie
              </span>
            </div>
            <div className="relative aspect-[3/4] bg-gradient-to-br from-sky-200 via-blue-200 to-indigo-200">
              <span className="absolute left-2 top-2 rounded bg-black/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                After — AI headshot
              </span>
            </div>
          </div>
          <figcaption className="px-4 py-3 text-sm text-muted">
            <span className="font-medium text-ink">{pair.label}</span>
            {" · "}Real customer result (placeholder)
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
