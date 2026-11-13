import Link from "next/link";
import { BeforeAfter } from "@/components/BeforeAfter";
import { FAQ } from "@/components/FAQ";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-soft bg-gradient-to-b from-surface via-white to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(77,124,254,0.18), transparent 40%), radial-gradient(circle at 80% 0%, rgba(77,124,254,0.12), transparent 35%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-14 sm:pb-24 sm:pt-20">
          <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl sm:leading-[1.1]">
            Professional headshots that actually look like you.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Upload 8 photos. See one free preview in minutes. Unlock 40
            headshots in 4K for $29 — no subscription.
          </p>
          <p className="mt-2 text-sm text-muted">No subscription. One-time $29.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/upload"
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-base font-medium text-white shadow-soft hover:bg-accent-hover"
            >
              Get my free preview
            </Link>
            <a
              href="#examples"
              className="inline-flex h-12 items-center justify-center rounded-full border border-soft bg-white px-6 text-base font-medium text-ink hover:bg-surface"
            >
              See examples
            </a>
          </div>
          <p className="mt-3 text-sm text-muted">
            Free preview takes about 3 minutes.
          </p>
          <p className="mt-6 text-sm font-medium text-ink/80">
            Private model · Photos deleted in 7 days · No subscription
          </p>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Before & after
        </h2>
        <p className="mt-2 text-muted">
          Placeholder examples for D0 — replace with real generations before launch.
        </p>
        <div className="mt-8">
          <BeforeAfter />
        </div>
      </section>

      {/* Steps */}
      <section className="bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Three steps
          </h2>
          <p className="mt-2 text-muted">Upload → Free preview → Unlock 4K</p>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                n: "1",
                t: "Upload 8–10 photos",
                d: "Front-facing selfies in good light. Phone camera is fine.",
              },
              {
                n: "2",
                t: "Get a free preview",
                d: "One watermarked headshot plus a likeness score — in minutes.",
              },
              {
                n: "3",
                t: "Unlock 40 in 4K",
                d: "$29 once. Pick 4 favorites and download your role-specific PDF.",
              },
            ].map((step) => (
              <li key={step.n}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                  {step.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{step.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          What you get
        </h2>
        <p className="mt-2 text-muted">
          A studio session costs $150–300. This is $29, once.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-soft bg-white p-6 shadow-soft sm:p-8">
            <h3 className="text-lg font-semibold text-ink">Free</h3>
            <p className="mt-1 text-3xl font-semibold text-ink">$0</p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              <li>1× 512px watermarked preview</li>
              <li>Likeness score (0–100)</li>
              <li>1 bio tip for your role</li>
              <li>1 free preview per email / device</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-accent/30 bg-white p-6 shadow-soft ring-1 ring-accent/20 sm:p-8">
            <h3 className="text-lg font-semibold text-ink">Pro</h3>
            <p className="mt-1 text-3xl font-semibold text-ink">
              $29{" "}
              <span className="text-base font-normal text-muted">once</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              <li>40 headshots in 4K</li>
              <li>Choose 4 to download</li>
              <li>PDF: 3 bios + 3 interview openers + 10 keywords</li>
              <li>1 free redo if generation fails</li>
            </ul>
            <Link
              href="/upload"
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-accent text-base font-medium text-white hover:bg-accent-hover"
            >
              Get my free preview
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof placeholder */}
      <section className="bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-20">
          <p className="text-lg font-medium text-ink">Built for job seekers</p>
          <p className="mt-2 text-muted">
            Photos deleted in 7 days. Never used for training.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          FAQ
        </h2>
        <div className="mt-8">
          <FAQ />
        </div>
      </section>

      {/* Privacy strip */}
      <section className="border-t border-soft bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center">
          <p className="text-sm font-medium text-ink">
            Photos deleted in 7 days. Never used for training.
          </p>
          <p className="mt-2 text-sm text-muted">
            Free redo if generation fails.
          </p>
        </div>
      </section>
    </div>
  );
}
