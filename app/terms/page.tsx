export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14 prose-headings:font-semibold">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Terms of Service</h1>
      <p className="mt-4 text-sm text-muted">Last updated: November 12, 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink">
        <section>
          <h2 className="text-lg font-semibold">1. Service</h2>
          <p className="mt-2 text-muted">
            AI Career Headshots provides AI-generated professional headshots and
            role-specific bio copy. Results are AI-assisted and are not guaranteed
            to match your appearance perfectly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. Eligibility</h2>
          <p className="mt-2 text-muted">
            You must be 18 or older. You may only upload photos of yourself and
            confirm you have the right to use them.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. Pricing</h2>
          <p className="mt-2 text-muted">
            The free tier provides one watermarked preview and likeness score per
            email/device. The Pro package is a one-time payment of $29 USD for 40
            4K headshots (choose 4 to download), a bio PDF, and one free redo if
            generation fails.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Payments & refunds</h2>
          <p className="mt-2 text-muted">
            We refund only when generation fails after automatic retries. Once
            results have been delivered and are available for download, purchases
            are not refundable for subjective dissatisfaction. One free redo is
            included with Pro.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. EU/UK withdrawal waiver</h2>
          <p className="mt-2 text-muted">
            If you are in the EU or UK, digital content is delivered immediately
            after payment. By checking the checkout box, you request immediate
            delivery and waive your 14-day right of withdrawal for that purchase.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">6. License</h2>
          <p className="mt-2 text-muted">
            You receive a personal, commercial-use license to use your selected
            headshots on your own profiles, resumes, and marketing. You may not
            resell the raw outputs as a stock product.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">7. Contact</h2>
          <p className="mt-2 text-muted">
            Questions:{" "}
            <a className="text-accent hover:underline" href="mailto:hello@example.com">
              hello@example.com
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}
