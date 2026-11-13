import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-soft bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-base font-semibold tracking-tight text-ink">
          AI Career Headshots
        </Link>
        <nav className="flex items-center gap-4">
          <a
            href="/#pricing"
            className="hidden text-sm text-muted hover:text-ink sm:inline"
          >
            Pricing
          </a>
          <Link
            href="/upload"
            className="inline-flex h-10 items-center rounded-full bg-accent px-4 text-sm font-medium text-white shadow-soft hover:bg-accent-hover"
          >
            Get my free preview
          </Link>
        </nav>
      </div>
    </header>
  );
}
