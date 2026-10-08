// Shared shell for the legal pages: same studio chrome as the generator so
// the policies feel like part of the product, not an afterthought.
import Link from "next/link";
import type { ReactNode } from "react";

export function LegalShell({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="min-h-screen" style={{ background: "var(--ink)" }}>
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 pt-8">
        <Link href="/" style={{ fontFamily: "var(--font-display), serif", fontSize: 24, letterSpacing: "-0.02em" }}>
          card studio<span style={{ color: "var(--accent)" }}>.</span>
        </Link>
        <Link href="/app" className="text-[13px] font-semibold" style={{ color: "var(--accent)" }}>
          Back to the studio
        </Link>
      </header>
      <article className="mx-auto max-w-3xl px-6 py-10">
        <h1 style={{ fontFamily: "var(--font-display), serif", fontSize: 42, letterSpacing: "-0.02em" }}>{title}</h1>
        <p className="mt-2 text-[12px] uppercase" style={{ letterSpacing: "0.2em", color: "var(--muted)" }}>
          Effective {updated}
        </p>
        <div className="legal-body mt-8 space-y-6 text-[15px] leading-relaxed" style={{ color: "var(--fg)" }}>
          {children}
        </div>
        <p className="mt-12 text-[13px]" style={{ color: "var(--muted)" }}>
          <Link href="/privacy" className="underline">Privacy Policy</Link> · <Link href="/terms" className="underline">Terms of Use</Link>
        </p>
      </article>
    </main>
  );
}

export function H({ children }: { children: ReactNode }) {
  return <h2 className="pt-2 text-[18px] font-bold">{children}</h2>;
}

export function P({ children }: { children: ReactNode }) {
  return <p style={{ color: "var(--muted)" }}>{children}</p>;
}
