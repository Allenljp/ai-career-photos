import Link from "next/link";
import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";
import { BeforeAfter } from "@/components/BeforeAfter";
import { FAQ } from "@/components/FAQ";
import { HeroPortrait } from "@/components/HeroPortrait";

export default function HomePage() {
  return (
    <div>
      <AnalyticsBeacon name="view_home" />
      {/* Hero — one composition: brand + H1 + support + CTA + full-bleed portrait */}
      <section className="relative overflow-hidden border-b border-soft">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 12% 18%, rgba(14,107,102,0.14), transparent 55%), radial-gradient(ellipse 55% 45% at 92% 8%, rgba(197,206,214,0.65), transparent 48%), linear-gradient(165deg, #e7edf0 0%, #f3f5f7 48%, #dfe6ea 100%)",
          }}
        />
        <div className="studio-grain" aria-hidden />

        <div className="relative mx-auto flex max-w-6xl flex-col lg:min-h-[calc(100vh-4rem)] lg:flex-row lg:items-stretch">
          <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:w-[46%] lg:py-20 xl:w-[42%]">
            <p className="animate-hero-rise font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-ink">
              AI Career Headshots
            </p>
            <h1 className="animate-hero-rise-delay mt-6 max-w-xl text-balance font-display text-[clamp(1.65rem,3.8vw,2.35rem)] font-semibold leading-[1.15] tracking-tight text-ink">
              See a headshot that looks like you — before you pay.
            </h1>
            <p className="animate-hero-rise-delay-2 mt-5 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
              Upload eight photos. We’ll return one free watermarked preview
              with a likeness score. If it’s you, unlock forty 4K shots plus a
              role-ready bio pack for $29 — once.
            </p>
            <div className="animate-hero-rise-delay-2 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/upload"
                className="inline-flex h-12 items-center justify-center rounded-btn bg-accent px-6 text-base font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Get free preview
              </Link>
              <a
                href="#examples"
                className="inline-flex h-12 items-center justify-center rounded-btn border border-soft bg-paper/60 px-6 text-base font-medium text-ink transition-colors hover:bg-surface"
              >
                See examples
              </a>
            </div>
            <p className="animate-hero-rise-delay-2 mt-4 text-sm text-muted">
              About three minutes · no subscription
            </p>
            <p className="animate-hero-rise-delay-2 mt-5 text-sm font-medium text-ink-soft">
              Private model · Photos deleted in 7 days · $29 once
            </p>
          </div>

          {/* Full-bleed to viewport right edge on desktop */}
          <div className="animate-hero-portrait relative w-full lg:absolute lg:inset-y-0 lg:right-0 lg:w-[54%] xl:w-[58%]">
            <div className="h-[min(78vw,440px)] w-full lg:h-full">
              <HeroPortrait />
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          From phone selfie to profile photo
        </h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Illustrative pairs for now — real customer generations replace these
          before launch.
        </p>
        <div className="mt-10">
          <BeforeAfter />
        </div>
      </section>

      {/* Steps */}
      <section className="border-y border-soft bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Three steps. Pay on the last one.
          </h2>
          <p className="mt-2 text-ink-soft">Likeness first. Checkout second.</p>
          <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {[
              {
                n: "01",
                t: "Upload 8–10 photos",
                d: "Front-facing, good light. Your phone camera is enough.",
              },
              {
                n: "02",
                t: "Review your free preview",
                d: "One watermarked headshot and a likeness score (0–100).",
              },
              {
                n: "03",
                t: "Unlock the full set",
                d: "$29 once: 40 in 4K, pick 4, plus a PDF for your target role.",
              },
            ].map((step) => (
              <li key={step.n}>
                <p className="font-display text-sm font-semibold tracking-widest text-accent">
                  {step.n}
                </p>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                  {step.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing — cards OK: user decision containers */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          What you get
        </h2>
        <p className="mt-2 text-ink-soft">
          A studio session runs $150–300. This is $29, once.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="border border-soft bg-paper p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-ink">Free</h3>
            <p className="mt-1 font-display text-3xl font-semibold text-ink">$0</p>
            <ul className="mt-6 space-y-3 text-sm text-ink-soft">
              <li>1× 512px watermarked preview</li>
              <li>Likeness score (0–100)</li>
              <li>1 bio tip for your role</li>
              <li>One free preview per email / device</li>
            </ul>
          </div>
          <div className="border border-accent/35 bg-accent-soft/40 p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-ink">Pro</h3>
            <p className="mt-1 font-display text-3xl font-semibold text-ink">
              $29{" "}
              <span className="text-base font-normal text-muted">once</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ink-soft">
              <li>40 headshots in 4K</li>
              <li>Choose 4 to download</li>
              <li>PDF: 3 bios + 3 interview openers + 10 keywords</li>
              <li>1 free redo if generation fails</li>
            </ul>
            <Link
              href="/upload"
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-btn bg-accent text-base font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Start with free preview
            </Link>
          </div>
        </div>
      </section>

      {/* Single trust band — no fake testimonials */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 sm:py-16">
          <p className="font-display text-lg font-semibold text-ink sm:text-xl">
            Built for people updating LinkedIn, resumes, and company pages.
          </p>
          <p className="mt-3 text-ink-soft">
            Photos and results deleted in 7 days. Never used to train public
            models.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          FAQ
        </h2>
        <div className="mt-6">
          <FAQ />
        </div>
      </section>

      {/* Closing privacy strip */}
      <section className="border-t border-soft bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6">
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
