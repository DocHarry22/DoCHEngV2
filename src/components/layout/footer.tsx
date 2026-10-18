import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-0)]">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent-secondary)]">
            DoCHEng Parent Ecosystem
          </p>
          <p className="mt-2 max-w-md text-sm text-[var(--text-subtle)]">
            Purposeful software for engineering, research, documents and
            technical careers. Native releases are published as they are
            verified.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Explore
          </p>
          <Link
            href="/about"
            className="text-sm text-[var(--text-subtle)] hover:text-[var(--text-main)]"
          >
            About
          </Link>
          <Link
            href="/apps"
            className="text-sm text-[var(--text-subtle)] hover:text-[var(--text-main)]"
          >
            Apps Hub
          </Link>
          <Link
            href="/#products"
            className="text-sm text-[var(--text-subtle)] hover:text-[var(--text-main)]"
          >
            Products
          </Link>

          <Link
            href="/pricing"
            className="text-sm text-[var(--text-subtle)] hover:text-[var(--text-main)]"
          >
            Pricing
          </Link>
          <Link
            href="/changelog"
            className="text-sm text-[var(--text-subtle)] hover:text-[var(--text-main)]"
          >
            Changelog
          </Link>
          <Link
            href="/docs"
            className="text-sm text-[var(--text-subtle)] hover:text-[var(--text-main)]"
          >
            Documentation
          </Link>
          <Link
            href="/roadmap"
            className="text-sm text-[var(--text-subtle)] hover:text-[var(--text-main)]"
          >
            Roadmap
          </Link>
          <Link
            href="/downloads"
            className="text-sm text-[var(--text-subtle)] hover:text-[var(--text-main)]"
          >
            Downloads
          </Link>
          <Link
            href="/ecosystem"
            className="text-sm text-[var(--text-subtle)] hover:text-[var(--text-main)]"
          >
            Architecture
          </Link>
          <Link
            href="/support"
            className="text-sm text-[var(--text-subtle)] hover:text-[var(--text-main)]"
          >
            Support
          </Link>
        </div>
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <Link className="text-link" href="/tools">
            Free engineering tools
          </Link>
          <Link className="text-link" href="/privacy">
            Privacy and data controls
          </Link>
          <Link className="text-link" href="/terms">
            Terms and release policies
          </Link>
          <p className="text-sm text-[var(--text-subtle)]">
            Built for students, professionals, researchers, and technical
            operators.
          </p>
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Domain: docheng.co.za
          </p>
        </div>
      </div>
    </footer>
  );
}
