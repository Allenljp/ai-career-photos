type Pair = {
  label: string;
};

const PAIRS: Pair[] = [
  { label: "Marketing" },
  { label: "Engineering" },
  { label: "Early career" },
];

export function BeforeAfter() {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0">
      {PAIRS.map((pair) => (
        <figure key={pair.label} className="min-w-[260px] shrink-0 snap-center sm:min-w-0">
          <div className="grid grid-cols-2 overflow-hidden">
            <div className="relative aspect-[3/4] bg-gradient-to-br from-studio to-studio-deep/80">
              <span className="absolute bottom-3 left-3 text-[10px] font-medium uppercase tracking-[0.14em] text-ink/70">
                Before — phone selfie
              </span>
            </div>
            <div className="relative aspect-[3/4] bg-gradient-to-br from-accent-soft via-studio to-studio-deep">
              <span className="absolute bottom-3 left-3 text-[10px] font-medium uppercase tracking-[0.14em] text-ink/70">
                After — AI headshot
              </span>
            </div>
          </div>
          <figcaption className="mt-3 text-sm text-muted">
            <span className="font-medium text-ink">{pair.label}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
