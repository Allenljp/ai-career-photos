import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-soft bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} AI Career Headshots</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <a href="mailto:hello@example.com" className="hover:text-ink">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
