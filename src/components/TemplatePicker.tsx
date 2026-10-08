"use client";
// All ten templates rendered live in miniature - the picker is not screenshots
// or swatches, it is the actual cards with your actual details in them.
import { FitStage } from "./CardStage";
import { TEMPLATES } from "@/lib/templates";
import type { CardProfile } from "@/lib/profile";

interface Props {
  p: CardProfile;
  qrs: (string | null)[];
  active: number;
  onPick: (id: number) => void;
}

const THUMB_W = 208;

export default function TemplatePicker({ p, qrs, active, onPick }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => onPick(t.id)}
          className="group text-left transition-transform hover:-translate-y-1"
          aria-pressed={active === t.id}
        >
          <div
            className="overflow-hidden rounded-lg"
            style={{
              outline: active === t.id ? "2px solid var(--accent)" : "1px solid var(--line)",
              outlineOffset: 2,
            }}
          >
            <FitStage p={p} qr={qrs[t.id] ?? null} templateId={t.id} maxScale={THUMB_W / 560} />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[13px] font-semibold" style={{ color: active === t.id ? "var(--accent)" : "var(--fg)" }}>
              {String(t.id + 1).padStart(2, "0")} {t.name}
            </span>
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>{t.blurb}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
