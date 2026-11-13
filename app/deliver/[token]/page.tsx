type Props = { params: { token: string } };

export default function DeliverPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Your headshots are ready
      </h1>
      <p className="mt-2 text-sm text-muted">Delivery token {params.token}</p>
      <p className="mt-2 text-sm text-muted">0 of 4 selected</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl border border-soft bg-gradient-to-br from-slate-100 to-slate-200"
          />
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-accent text-white opacity-50"
        >
          Download selected (4K)
        </button>
        <button
          type="button"
          disabled
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-soft bg-white text-ink opacity-50"
        >
          Download bio pack (PDF)
        </button>
      </div>
      <button
        type="button"
        disabled
        className="mt-4 text-sm text-muted underline opacity-50"
      >
        Redo once
      </button>
      <p className="mt-4 text-sm text-muted">
        Your files stay available for 7 days.
      </p>
    </div>
  );
}
