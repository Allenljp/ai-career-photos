export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted">Last updated: November 12, 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink">
        <section>
          <h2 className="text-lg font-semibold">1. What we collect</h2>
          <p className="mt-2 text-muted">
            Photos you upload, email address, order metadata (role, style),
            device fingerprint for free-tier limits, payment references from our
            merchant of record (Creem), and basic analytics events.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. How we use data</h2>
          <p className="mt-2 text-muted">
            To generate your headshots and bio pack, process payment, email
            delivery links, prevent free-tier abuse, and improve reliability. We
            never use your photos to train public models.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. Retention</h2>
          <p className="mt-2 text-muted">
            Original uploads and generated images are deleted within 7 days.
            Order and payment records may be retained as required for accounting
            and fraud prevention.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Processors</h2>
          <p className="mt-2 text-muted">
            We use infrastructure and AI providers (e.g. storage, image
            generation, email, payments) solely to deliver the service. Training
            options on third-party APIs are disabled where available.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. Your rights</h2>
          <p className="mt-2 text-muted">
            You may request deletion of your photos and account data. Contact us
            and we will process requests promptly, subject to legal retention
            needs.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">6. Contact</h2>
          <p className="mt-2 text-muted">
            Privacy requests:{" "}
            <a className="text-accent hover:underline" href="mailto:hello@example.com">
              hello@example.com
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}
