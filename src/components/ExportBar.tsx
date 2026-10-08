"use client";
// Everything that takes the card out of the browser: PNG for digital sharing,
// print for physical cards, .vcf for a direct contact file, copy for paste.
import { toPng } from "html-to-image";
import { downloadVcf, buildVCard } from "@/lib/vcard";
import type { CardProfile } from "@/lib/profile";
import type { RefObject } from "react";
import { useState } from "react";

interface Props {
  cardRef: RefObject<HTMLDivElement | null>;
  profile: CardProfile; // the real profile (not sample-filled) for the vCard
}

function slug(name: string) {
  return (name.trim() || "social-card").replace(/\s+/g, "-").toLowerCase();
}

export default function ExportBar({ cardRef, profile }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Rasterize the on-screen card node at 2x: 1120x640 PNG.
  const downloadPng = async () => {
    if (!cardRef.current) return;
    setBusy("png");
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${slug(profile.name)}.png`;
      a.click();
    } finally {
      setBusy(null);
    }
  };

  const copyVcard = async () => {
    await navigator.clipboard.writeText(buildVCard(profile));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const btn = (label: string, onClick: () => void, primary = false, key: string) => (
    <button
      key={key}
      onClick={onClick}
      disabled={busy !== null}
      className="rounded-xl px-4 py-2.5 text-[14px] font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      style={
        primary
          ? { background: "var(--accent)", color: "var(--accent-ink)" }
          : { background: "var(--raised)", border: "1px solid var(--line)", color: "var(--fg)" }
      }
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      {btn(busy === "png" ? "Rendering..." : "Download PNG", downloadPng, true, "png")}
      {btn("Print card", () => window.print(), false, "print")}
      {btn("Download .vcf", () => downloadVcf(profile), false, "vcf")}
      {btn(copied ? "Copied!" : "Copy vCard", copyVcard, false, "copy")}
      <span className="text-[12px]" style={{ color: "var(--muted)" }}>
        QR saves you as a contact - scan it with any phone camera.
      </span>
    </div>
  );
}
