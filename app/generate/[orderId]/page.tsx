type Props = { params: { orderId: string } };

export default function GeneratePage({ params }: Props) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Generating your headshots
      </h1>
      <p className="mt-2 text-sm text-muted">Order {params.orderId}</p>
      <div className="mt-10 h-2 overflow-hidden rounded-full bg-surface">
        <div className="h-full w-1/3 rounded-full bg-accent" />
      </div>
      <p className="mt-4 text-sm text-muted">Usually 3–8 minutes</p>
      <p className="mt-6 text-sm text-ink">
        You can close this page. We&apos;ll email you when they&apos;re ready.
      </p>
      <p className="mt-8 text-xs text-muted">
        Stub page — D2 wires status polling and delivery redirect.
      </p>
    </div>
  );
}
