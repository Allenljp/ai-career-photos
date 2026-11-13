type Props = { params: { orderId: string } };

export default function PreviewPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Your free preview
      </h1>
      <p className="mt-2 text-sm text-muted">Order {params.orderId}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-soft bg-gradient-to-br from-slate-100 to-slate-200 text-sm text-muted">
          Watermarked 512px preview (stub)
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-muted">
            Likeness score
          </p>
          <p className="mt-2 text-5xl font-semibold text-ink">—</p>
          <p className="mt-3 text-sm text-muted">
            Score and bio tip appear here after generation (D1).
          </p>

          <div className="mt-8 rounded-2xl border border-accent/30 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">Unlock my headshots</h2>
            <p className="mt-1 text-2xl font-semibold text-ink">
              $29 <span className="text-base font-normal text-muted">once</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>40 headshots in 4K</li>
              <li>Choose 4 to download</li>
              <li>Role-specific bio pack (PDF)</li>
              <li>1 free redo if generation fails</li>
            </ul>
            <button
              type="button"
              disabled
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-accent text-white opacity-50"
            >
              Unlock my headshots
            </button>
            <p className="mt-3 text-xs text-muted">Secure checkout by Creem.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
