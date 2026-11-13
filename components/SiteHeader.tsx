import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-soft bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-sm font-semibold tracking-tight text-ink sm:text-base"
        >
          AI Career Headshots
        </Link>
        <nav className="flex items-center gap-5">
          <a
            href="/#pricing"
            className="hidden text-sm text-muted transition-colors hover:text-ink sm:inline"
          >
            Pricing
          </a>
          <Link
            href="/upload"
            className="inline-flex h-10 items-center rounded-btn bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Get free preview
          </Link>
        </nav>
      </div>
    </header>
  );
}
