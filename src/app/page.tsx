"use client";
// Landing page (route: /) - the marketing front door. The studio itself
// lives at /app. Entrance motion is pure CSS (globals.css rise/floaty), so
// the page reads fully even before hydration. The hero fan shows three real
// templates rendered by the same CardStage the studio uses, with a real
// John Doe vCard QR generated on mount - what sells the product here IS
// the product.
import Link from "next/link";
import { useEffect, useState } from "react";
import CardStage from "@/components/CardStage";
import { TEMPLATES } from "@/lib/templates";
import { SAMPLE_PROFILE } from "@/lib/profile";
import { vcardQrDataUrl } from "@/lib/qr";

// Onyx leads the fan; Glass and Sunset peek from behind.
const FAN = [0, 5, 7];

const FEATURES = [
  {
    title: "Ten looks, one you",
    body: "Onyx at the gala, Terminal at the hackathon, Paper at the print shop. Swap templates live and your details follow - same you, better outfit.",
  },
  {
    title: "A scan, not a spelling bee",
    body: "The QR on every card is a genuine vCard. Someone scans it and you're in their contacts - no typos, no lost napkins, no 'remind me of your name'.",
  },
  {
    title: "Print or pocket",
    body: "Download a crisp PNG, print at true 3.5 x 2 in, save a .vcf or copy the vCard text. Their wallet or their camera roll - you choose.",
  },
  {
    title: "Yours alone",
    body: "Everything happens in your browser. Your details sit in this device's local storage and never touch a server.",
  },
] as const;

const STEPS = [
  { n: "01", title: "Type it once", body: "Name, role, links, photo - the form fills every template at once." },
  { n: "02", title: "Pick a look", body: "Ten live previews, all wearing your details. Click the one that feels like you." },
  { n: "03", title: "Share the scan", body: "Show the QR, hand over the print, send the PNG. They get you, saved." },
] as const;

export default function Landing() {
  const [qrs, setQrs] = useState<(string | null)[]>(FAN.map(() => null));

  // Real vCard QR for the sample profile, themed per template - the hero
  // card genuinely scans into John Doe's contact card.
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      FAN.map((id) => {
        const t = TEMPLATES[id];
        return vcardQrDataUrl(SAMPLE_PROFILE, t.qrDark, t.qrLight).catch(() => null);
      })
    ).then((out) => {
      if (!cancelled) setQrs(out);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden" style={{ background: "var(--ink)" }}>
      {/* nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <Link
          href="/"
          style={{ fontFamily: "var(--font-display), serif", fontSize: 26, letterSpacing: "-0.02em" }}
        >
          card studio<span style={{ color: "var(--accent)" }}>.</span>
        </Link>
        <div className="flex items-center gap-6">
          <a
            href="#how"
            className="hidden text-[13px] transition-colors hover:text-white sm:block"
            style={{ color: "var(--muted)" }}
          >
            How it works
          </a>
          <Link
            href="/app"
            className="rounded-full px-5 py-2.5 text-[13px] font-bold transition-transform hover:scale-[1.04] active:scale-95"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            Open the studio ↗
          </Link>
        </div>
      </nav>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-8 pb-20 md:grid-cols-[1.05fr_0.95fr] md:pt-12">
        <div>
          <p
            className="rise rise-1 flex items-center gap-2 text-[11px] font-medium uppercase"
            style={{ letterSpacing: "0.3em", color: "var(--accent)" }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            Ten templates · scan-to-save QR · print or digital
          </p>
          <h1
            className="rise rise-2 mt-5 text-5xl leading-[1.04] font-semibold tracking-tight sm:text-6xl md:text-7xl"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            Play your cards
            <br />
            <span style={{ color: "var(--accent)" }}>right into their phone.</span>
          </h1>
          <p className="rise rise-3 mt-6 max-w-md text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
            Card Studio turns your name, photo and links into a card worth keeping. Its QR is a real
            vCard - one scan and you&apos;re saved in their phone, spelled right, before the small
            talk ends.
          </p>
          <div className="rise rise-4 mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/app"
              className="rounded-2xl px-7 py-4 text-base font-bold transition-transform hover:scale-[1.03] active:scale-95"
              style={{
                background: "var(--accent)",
                color: "var(--accent-ink)",
                boxShadow: "0 10px 40px rgba(163, 230, 53, 0.25)",
              }}
            >
              Make your card ↗
            </Link>
            <a
              href="#how"
              className="rounded-2xl px-7 py-4 text-base font-medium transition-colors hover:text-white"
              style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
            >
              See how it works
            </a>
          </div>
          <p
            className="rise rise-5 mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-medium uppercase sm:text-[11px]"
            style={{ letterSpacing: "0.18em", color: "var(--muted)" }}
          >
            <span>No account</span>
            <span style={{ color: "var(--accent)" }}>✳</span>
            <span>Nothing uploaded</span>
            <span style={{ color: "var(--accent)" }}>✳</span>
            <span>Free forever</span>
          </p>
        </div>

        {/* hero fan - three real templates, real scannable QR */}
        <div className="rise rise-3 relative mx-auto w-full max-w-md">
          <div className="floaty-7 absolute top-14 -left-14" aria-hidden>
            <div className="-rotate-[10deg] opacity-90">
              <CardStage p={SAMPLE_PROFILE} qr={qrs[1]} templateId={FAN[1]} scale={0.62} />
            </div>
          </div>
          <div className="floaty-85 absolute top-14 -right-14" aria-hidden>
            <div className="rotate-[10deg] opacity-90">
              <CardStage p={SAMPLE_PROFILE} qr={qrs[2]} templateId={FAN[2]} scale={0.62} />
            </div>
          </div>
          <div className="floaty relative z-10 mx-auto w-fit">
            <CardStage p={SAMPLE_PROFILE} qr={qrs[0]} templateId={FAN[0]} scale={0.8} />
            <p
              className="mt-4 text-center text-[11px] uppercase"
              style={{ letterSpacing: "0.22em", color: "var(--muted)" }}
            >
              Go on, scan it - it really works
            </p>
          </div>
          {/* clearance under the side cards */}
          <div className="h-24" aria-hidden />
        </div>
      </section>

      {/* template name marquee */}
      <div
        className="overflow-hidden border-y py-4"
        style={{ borderColor: "var(--line)", background: "var(--surface)" }}
        aria-hidden
      >
        <div className="marquee-track gap-8">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-8 pr-8">
              {TEMPLATES.map((t) => (
                <span
                  key={`${copy}-${t.id}`}
                  className="flex items-center gap-8 text-[13px] font-medium tracking-[0.25em] uppercase"
                  style={{ color: "var(--muted)", fontFamily: "var(--font-mono), monospace" }}
                >
                  {t.name}
                  <span style={{ color: "var(--accent)" }}>✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* features */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <article
              key={f.title}
              className={`rise rise-${i + 2} group rounded-3xl p-7 transition-transform hover:-translate-y-1`}
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <h3
                className="text-2xl font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-display), serif" }}
              >
                {f.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--muted)" }}>
                {f.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-[11px] font-medium uppercase" style={{ letterSpacing: "0.3em", color: "var(--accent)" }}>
            How it works
          </p>
          <h2
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            Three steps. No manual.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="text-sm font-bold" style={{ color: "var(--accent)", fontFamily: "var(--font-mono), monospace" }}>
                  {s.n}
                </p>
                <h3 className="mt-2 text-lg font-semibold" style={{ fontFamily: "var(--font-display), serif" }}>
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-14">
            <Link
              href="/app"
              className="inline-block rounded-2xl px-7 py-4 text-base font-bold transition-transform hover:scale-[1.03] active:scale-95"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              Make your card ↗
            </Link>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer style={{ borderTop: "1px solid var(--line)" }}>
        <div
          className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-[12px] sm:flex-row sm:items-center"
          style={{ color: "var(--muted)" }}
        >
          <span style={{ fontFamily: "var(--font-display), serif", fontSize: 16, color: "var(--fg)" }}>
            card studio<span style={{ color: "var(--accent)" }}>.</span>
          </span>
          <div className="flex items-center gap-4">
            <p className="tracking-wider uppercase">Next.js ✳ Tailwind ✳ framer-motion ✳ qrcode</p>
            <Link href="/privacy" className="underline underline-offset-2 transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="underline underline-offset-2 transition-colors hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
