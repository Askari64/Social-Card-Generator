"use client";
// Card Studio: form on the left, live card + ten-template picker on the
// right, export bar under the stage. The QR encodes the real vCard (only
// what the user typed); the preview fills blanks with sample data so empty
// fields never make a template look broken.
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import CardStage from "@/components/CardStage";
import TemplatePicker from "@/components/TemplatePicker";
import EditorForm from "@/components/EditorForm";
import ExportBar from "@/components/ExportBar";
import { SplitText, Rise } from "@/components/bits";
import { TEMPLATES } from "@/lib/templates";
import { vcardQrDataUrl } from "@/lib/qr";
import {
  loadProfile, saveProfile, loadTemplateId, saveTemplateId,
  withSample, EMPTY_PROFILE, type CardProfile,
} from "@/lib/profile";

export default function Home() {
  const [profile, setProfile] = useState<CardProfile>(EMPTY_PROFILE);
  const [templateId, setTemplateId] = useState(0);
  const [qrs, setQrs] = useState<(string | null)[]>(Array(10).fill(null));
  const [hydrated, setHydrated] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Load the saved profile + template after mount (localStorage is
  // browser-only, so this waits for hydration to avoid a mismatch).
  useEffect(() => {
    setProfile(loadProfile());
    setTemplateId(loadTemplateId());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveProfile(profile);
  }, [profile, hydrated]);

  useEffect(() => {
    if (hydrated) saveTemplateId(templateId);
  }, [templateId, hydrated]);

  // Regenerate all ten themed QRs when the details change (debounced).
  // The QR carries the raw profile - never sample filler.
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      const out = await Promise.all(
        TEMPLATES.map((tpl) => vcardQrDataUrl(profile, tpl.qrDark, tpl.qrLight).catch(() => null))
      );
      if (!cancelled) setQrs(out);
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [profile]);

  // Preview gets sample fill; exports and the QR use the real profile.
  const preview = useMemo(() => withSample(profile), [profile]);

  return (
    <main className="min-h-screen" style={{ background: "var(--ink)" }}>
      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 pt-8">
        <div style={{ fontFamily: "var(--font-display), serif", fontSize: 30, letterSpacing: "-0.02em" }}>
          <SplitText text="card studio" />
          <span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <div className="hidden text-[12px] uppercase sm:block" style={{ letterSpacing: "0.2em", color: "var(--muted)" }}>
          10 templates · scan-to-save QR · print or digital
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-8 lg:grid-cols-[minmax(320px,420px)_1fr]">
        {/* Editor */}
        <Rise delay={0.1} className="order-2 lg:order-1">
          <div
            className="rounded-2xl p-5 lg:sticky lg:top-6"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
          >
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-[15px] font-bold">Your details</h2>
              <span className="text-[11px]" style={{ color: "var(--muted)" }}>saved on this device only</span>
            </div>
            <EditorForm profile={profile} onChange={setProfile} />
          </div>
        </Rise>

        {/* Stage + picker */}
        <div className="order-1 lg:order-2">
          <Rise delay={0.05}>
            <div className="studio-grid rounded-2xl p-6 sm:p-10" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
              <div className="mx-auto w-fit max-w-full overflow-hidden">
                <CardStage ref={cardRef} p={preview} qr={qrs[templateId] ?? null} templateId={templateId} scale={1} />
              </div>
              <div className="mt-6">
                <ExportBar cardRef={cardRef} profile={profile} />
              </div>
            </div>
          </Rise>

          <Rise delay={0.15} className="mt-8">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-[15px] font-bold">Pick a template</h2>
              <span className="text-[11px]" style={{ color: "var(--muted)" }}>live previews, your details</span>
            </div>
            <TemplatePicker p={preview} qrs={qrs} active={templateId} onPick={setTemplateId} />
          </Rise>
        </div>
      </div>

      <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 pb-10 text-[12px]" style={{ color: "var(--muted)" }}>
        <span>The QR code is a real vCard - anyone who scans it gets your contact saved straight to their phone. No account, no server, nothing uploaded.</span>
        <span className="flex gap-4">
          <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>
          <Link href="/terms" className="underline underline-offset-2">Terms of Use</Link>
        </span>
      </footer>

      {/* Print-only copy: rendered at exact 3.5in x 2in, visible only in print. */}
      <div id="print-card" aria-hidden>
        <div className="print-scale">
          <CardStage p={preview} qr={qrs[templateId] ?? null} templateId={templateId} scale={1} />
        </div>
      </div>
    </main>
  );
}
