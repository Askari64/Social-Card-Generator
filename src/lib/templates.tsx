// The ten card faces. Each template is a self-contained component that lays
// the same CardProfile out in a different visual language. Design canvas is a
// fixed 560x320 (business-card ratio 1.75:1); the preview scales it with CSS
// transforms and the exporter rasterizes it at 2x, so every pixel here is
// what lands in the PNG and the printout.
import type { CardProfile } from "./profile";

export interface TemplateDef {
  id: number;
  name: string;
  blurb: string;
  /** module colors for the QR code */
  qrDark: string;
  qrLight: string;
  Card: React.FC<CardRenderProps>;
}

export interface CardRenderProps {
  p: CardProfile; // profile with sample fill applied
  qr: string | null; // QR data URL themed with qrDark/qrLight
}

// Round avatar: the uploaded photo, or a monogram tile when there is none.
function Avatar({ p, size = 56, bg = "#111", fg = "#fff", ring = "transparent" }: { p: CardProfile; size?: number; bg?: string; fg?: string; ring?: string }) {
  const initial = (p.name.trim()[0] || "?").toUpperCase();
  return (
    <div
      style={{ width: size, height: size, borderColor: ring }}
      className="shrink-0 overflow-hidden rounded-full border-2"
    >
      {p.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div
          style={{ background: bg, color: fg, fontSize: size * 0.44 }}
          className="flex h-full w-full items-center justify-center font-bold"
        >
          {initial}
        </div>
      )}
    </div>
  );
}

// The QR tile, themed. Kept as an <img> so html-to-image captures it exactly.
function Qr({ qr, size = 92, dark, light, pad = 6, radius = 10 }: { qr: string | null; size?: number; dark: string; light: string; pad?: number; radius?: number }) {
  return (
    <div style={{ background: light, padding: pad, borderRadius: radius, width: size + pad * 2, height: size + pad * 2 }} className="shrink-0">
      {qr ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qr} alt="Scan to save contact" width={size} height={size} style={{ width: size, height: size }} />
      ) : (
        <div style={{ width: size, height: size, background: `repeating-conic-gradient(${dark} 0 25%, ${light} 0 50%) 0 0/16px 16px` }} />
      )}
    </div>
  );
}

// Compact contact rows used by several templates.
function contactRows(p: CardProfile): string[] {
  const rows = [p.phone, p.email, p.website, p.linkedin && "linkedin.com/" + p.linkedin.replace(/^in\//, ""), p.github && "github.com/" + p.github];
  return rows.filter(Boolean) as string[];
}

/* 1 - Onyx: near-black minimalism, hairline rules, mono metadata. */
function OnyxCard({ p, qr }: CardRenderProps) {
  return (
    <div className="flex h-full w-full flex-col justify-between p-8" style={{ background: "#0a0a0b", color: "#fafafa", border: "1px solid #27272a" }}>
      <div className="flex items-start justify-between">
        <div>
          <div style={{ fontFamily: "var(--font-display), serif", fontSize: 40, lineHeight: 1.02, letterSpacing: "-0.02em" }}>{p.name}</div>
          <div className="mt-2 text-[11px] uppercase" style={{ letterSpacing: "0.28em", color: "#a1a1aa" }}>{p.title}{p.company ? ` · ${p.company}` : ""}</div>
        </div>
        <Avatar p={p} bg="#fafafa" fg="#0a0a0b" ring="#3f3f46" />
      </div>
      <div className="flex items-end justify-between">
        <div className="space-y-1 text-[11px]" style={{ fontFamily: "var(--font-mono), monospace", color: "#d4d4d8" }}>
          {contactRows(p).slice(0, 4).map((r) => <div key={r}>{r}</div>)}
        </div>
        <Qr qr={qr} dark="#0a0a0b" light="#fafafa" size={84} pad={5} radius={4} />
      </div>
    </div>
  );
}

/* 2 - Aurora: earth-gradient mesh, his green/blue world. */
function AuroraCard({ p, qr }: CardRenderProps) {
  return (
    <div className="relative h-full w-full overflow-hidden p-8" style={{ background: "linear-gradient(120deg,#052e16 0%,#065f46 38%,#0369a1 72%,#1e1b4b 100%)", color: "#f0fdf4" }}>
      <div style={{ position: "absolute", width: 320, height: 320, right: -80, top: -120, borderRadius: "50%", background: "radial-gradient(circle,#4ade8055,transparent 65%)" }} />
      <div style={{ position: "absolute", width: 260, height: 260, left: -60, bottom: -120, borderRadius: "50%", background: "radial-gradient(circle,#38bdf855,transparent 65%)" }} />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center gap-4">
          <Avatar p={p} bg="#4ade80" fg="#052e16" ring="rgba(255,255,255,.35)" />
          <div>
            <div style={{ fontFamily: "var(--font-display), serif", fontSize: 34, lineHeight: 1.05 }}>{p.name}</div>
            <div className="text-[11px] uppercase" style={{ letterSpacing: "0.24em", color: "#a7f3d0" }}>{p.title}{p.company ? ` at ${p.company}` : ""}</div>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-1 text-[11.5px]" style={{ color: "#d1fae5" }}>
            {contactRows(p).slice(0, 4).map((r) => <div key={r}>{r}</div>)}
          </div>
          <Qr qr={qr} dark="#052e16" light="#f0fdf4" size={86} radius={14} />
        </div>
      </div>
    </div>
  );
}

/* 3 - Blueprint: engineering drawing, cyan on navy. */
function BlueprintCard({ p, qr }: CardRenderProps) {
  const grid = "linear-gradient(rgba(103,232,249,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(103,232,249,.09) 1px,transparent 1px)";
  return (
    <div className="relative h-full w-full p-8" style={{ background: "#0b2447", backgroundImage: grid, backgroundSize: "28px 28px", color: "#e0f2fe", fontFamily: "var(--font-mono), monospace" }}>
      <div className="absolute left-0 top-0 h-full w-full" style={{ border: "1px solid rgba(103,232,249,.35)", margin: 10, width: "calc(100% - 20px)", height: "calc(100% - 20px)" }} />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <div className="text-[10px] uppercase" style={{ letterSpacing: "0.3em", color: "#67e8f9" }}>FIG. 01 - CONTACT CARD</div>
          <div className="mt-3" style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.01em" }}>{p.name}</div>
          <div className="mt-1 text-[11px]" style={{ color: "#7dd3fc" }}>{`// ${p.title}${p.company ? " @ " + p.company : ""}`}</div>
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-1 text-[10.5px]" style={{ color: "#bae6fd" }}>
            {contactRows(p).slice(0, 4).map((r, i) => <div key={r}><span style={{ color: "#67e8f9" }}>{String(i + 1).padStart(2, "0")}</span>&nbsp;&nbsp;{r}</div>)}
          </div>
          <Qr qr={qr} dark="#0b2447" light="#e0f2fe" size={84} pad={5} radius={2} />
        </div>
      </div>
    </div>
  );
}

/* 4 - Brutal: neo-brutalist blocks, hard shadows, cream and yellow. */
function BrutalCard({ p, qr }: CardRenderProps) {
  return (
    <div className="h-full w-full p-7" style={{ background: "#fdf6e3", color: "#111", fontFamily: "var(--font-body), sans-serif" }}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div style={{ background: "#ffd500", border: "3px solid #111", boxShadow: "6px 6px 0 #111", padding: "10px 16px" }}>
            <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.02, letterSpacing: "-0.02em", textTransform: "uppercase" }}>{p.name}</div>
          </div>
          <Avatar p={p} bg="#111" fg="#ffd500" ring="#111" />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[12px] font-black uppercase" style={{ letterSpacing: "0.14em" }}>{p.title}{p.company ? ` - ${p.company}` : ""}</div>
            <div className="mt-2 space-y-0.5 text-[11px] font-bold">
              {contactRows(p).slice(0, 3).map((r) => <div key={r}>{r}</div>)}
            </div>
          </div>
          <div style={{ border: "3px solid #111", boxShadow: "5px 5px 0 #111", background: "#fff" }}>
            <Qr qr={qr} dark="#111111" light="#ffffff" size={80} pad={5} radius={0} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* 5 - Paper: letterpress print-shop card. */
function PaperCard({ p, qr }: CardRenderProps) {
  return (
    <div className="h-full w-full" style={{ background: "#f7f3ea", color: "#2b2620", padding: 12 }}>
      <div className="flex h-full w-full flex-col justify-between p-5" style={{ border: "1.5px solid #2b2620", outline: "1px solid #b9ad97", outlineOffset: 3 }}>
        <div className="text-center">
          <div className="text-[10px] uppercase" style={{ letterSpacing: "0.4em", color: "#8a7d63" }}>{p.company || "Personal"}</div>
          <div style={{ fontFamily: "var(--font-display), serif", fontSize: 38, lineHeight: 1.05 }}>{p.name}</div>
          <div className="mx-auto mt-2 h-px w-24" style={{ background: "#b3402a" }} />
          <div className="mt-1 text-[11.5px] italic" style={{ fontFamily: "var(--font-display), serif", color: "#6b5f4b" }}>{p.title}</div>
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-0.5 text-[10.5px]" style={{ fontFamily: "var(--font-mono), monospace", color: "#554a38" }}>
            {contactRows(p).slice(0, 3).map((r) => <div key={r}>{r}</div>)}
          </div>
          <Qr qr={qr} dark="#2b2620" light="#f7f3ea" size={76} pad={4} radius={0} />
        </div>
      </div>
    </div>
  );
}

/* 6 - Glass: frosted panel over color blobs (no backdrop-filter: simulated). */
function GlassCard({ p, qr }: CardRenderProps) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "#150e2e" }}>
      <div style={{ position: "absolute", width: 300, height: 300, left: -70, top: -90, borderRadius: "50%", background: "radial-gradient(circle,#a855f7aa,transparent 60%)" }} />
      <div style={{ position: "absolute", width: 280, height: 280, right: -60, bottom: -100, borderRadius: "50%", background: "radial-gradient(circle,#22d3eeaa,transparent 60%)" }} />
      <div className="relative m-5 flex flex-col justify-between p-5" style={{ height: "calc(100% - 40px)", background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 20, color: "#f5f3ff" }}>
        <div className="flex items-center gap-3">
          <Avatar p={p} bg="#a855f7" fg="#fff" ring="rgba(255,255,255,.3)" />
          <div>
            <div style={{ fontFamily: "var(--font-display), serif", fontSize: 30, lineHeight: 1.05 }}>{p.name}</div>
            <div className="text-[10.5px] uppercase" style={{ letterSpacing: "0.22em", color: "#d8b4fe" }}>{p.title}{p.company ? ` · ${p.company}` : ""}</div>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-1 text-[11px]" style={{ color: "#e9d5ff" }}>
            {contactRows(p).slice(0, 4).map((r) => <div key={r}>{r}</div>)}
          </div>
          <Qr qr={qr} dark="#150e2e" light="#f5f3ff" size={82} radius={12} />
        </div>
      </div>
    </div>
  );
}

/* 7 - Terminal: green-on-black console card. */
function TerminalCard({ p, qr }: CardRenderProps) {
  const g = "#4ade80";
  return (
    <div className="relative h-full w-full p-7" style={{ background: "#04120a", color: g, fontFamily: "var(--font-mono), monospace" }}>
      <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg,rgba(74,222,128,.05) 0 2px,transparent 2px 4px)" }} />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <div className="text-[11px]">{"$ whoami"}</div>
          <div style={{ fontSize: 34, fontWeight: 700, textShadow: "0 0 14px rgba(74,222,128,.45)" }}>{p.name}</div>
          <div className="mt-1 text-[11px]" style={{ color: "#86efac" }}>{`> ${p.title}${p.company ? " @ " + p.company : ""}`}</div>
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-1 text-[10.5px]" style={{ color: "#86efac" }}>
            {contactRows(p).slice(0, 4).map((r) => <div key={r}><span style={{ color: g }}>{"$ "}</span>{r}</div>)}
          </div>
          <Qr qr={qr} dark="#04120a" light="#4ade80" size={84} pad={5} radius={2} />
        </div>
      </div>
    </div>
  );
}

/* 8 - Sunset: warm gradient, rounded, playful sticker. */
function SunsetCard({ p, qr }: CardRenderProps) {
  return (
    <div className="relative h-full w-full overflow-hidden p-8" style={{ background: "linear-gradient(135deg,#ff9966 0%,#ff5e62 55%,#c2410c 130%)", color: "#fff7ed" }}>
      <div style={{ position: "absolute", right: -50, top: -50, width: 200, height: 200, borderRadius: "50%", border: "22px solid rgba(255,255,255,.25)" }} />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <div style={{ fontFamily: "var(--font-display), serif", fontSize: 38, lineHeight: 1.02 }}>{p.name}</div>
            <div className="mt-1 text-[11px] font-bold uppercase" style={{ letterSpacing: "0.2em" }}>{p.title}{p.company ? ` · ${p.company}` : ""}</div>
          </div>
          <Avatar p={p} bg="#fff7ed" fg="#c2410c" ring="rgba(255,255,255,.5)" />
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-1 text-[11.5px] font-semibold">
            {contactRows(p).slice(0, 4).map((r) => <div key={r}>{r}</div>)}
          </div>
          <Qr qr={qr} dark="#7c2d12" light="#fff7ed" size={84} radius={16} />
        </div>
      </div>
    </div>
  );
}

/* 9 - Editorial: magazine spread, serif, red accent. */
function EditorialCard({ p, qr }: CardRenderProps) {
  return (
    <div className="flex h-full w-full flex-col justify-between p-8" style={{ background: "#ffffff", color: "#141414" }}>
      <div className="flex items-start justify-between gap-4">
        <div style={{ fontFamily: "var(--font-display), serif", fontSize: 44, lineHeight: 0.98, letterSpacing: "-0.02em", maxWidth: 340 }}>
          {p.name}
          <span style={{ color: "#dc2626" }}>.</span>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase" style={{ letterSpacing: "0.3em", color: "#6b7280" }}>EST. CONTACT</div>
          <div className="mt-1 text-[10px] uppercase" style={{ letterSpacing: "0.3em", color: "#6b7280" }}>VOL. 01</div>
        </div>
      </div>
      <div className="h-[3px] w-full" style={{ background: "#141414" }} />
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[12px] font-bold uppercase" style={{ letterSpacing: "0.16em" }}>{p.title}{p.company ? `, ${p.company}` : ""}</div>
          <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-0.5 text-[10.5px]" style={{ color: "#374151" }}>
            {contactRows(p).slice(0, 4).map((r) => <div key={r}>{r}</div>)}
          </div>
        </div>
        <Qr qr={qr} dark="#141414" light="#ffffff" size={84} pad={4} radius={0} />
      </div>
    </div>
  );
}

/* 10 - Neon: deep purple with glowing cyan/magenta accents. */
function NeonCard({ p, qr }: CardRenderProps) {
  return (
    <div className="relative h-full w-full p-8" style={{ background: "#0d0221", color: "#e0e7ff" }}>
      <div className="absolute inset-4" style={{ border: "1.5px solid #22d3ee", borderRadius: 18, boxShadow: "0 0 18px rgba(34,211,238,.35), inset 0 0 18px rgba(34,211,238,.12)" }} />
      <div className="relative flex h-full flex-col justify-between px-3 py-2">
        <div className="flex items-center gap-4">
          <Avatar p={p} bg="#f0f" fg="#0d0221" ring="#f0abfc" />
          <div>
            <div style={{ fontFamily: "var(--font-display), serif", fontSize: 32, lineHeight: 1.05, color: "#f0abfc", textShadow: "0 0 16px rgba(240,171,252,.6)" }}>{p.name}</div>
            <div className="text-[10.5px] uppercase" style={{ letterSpacing: "0.26em", color: "#67e8f9" }}>{p.title}{p.company ? ` · ${p.company}` : ""}</div>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-1 text-[11px]" style={{ fontFamily: "var(--font-mono), monospace", color: "#a5b4fc" }}>
            {contactRows(p).slice(0, 4).map((r) => <div key={r}>{r}</div>)}
          </div>
          <Qr qr={qr} dark="#0d0221" light="#e0e7ff" size={82} radius={10} />
        </div>
      </div>
    </div>
  );
}

export const TEMPLATES: TemplateDef[] = [
  { id: 0, name: "Onyx", blurb: "Black-tie minimal", qrDark: "#0a0a0b", qrLight: "#fafafa", Card: OnyxCard },
  { id: 1, name: "Aurora", blurb: "Earth gradient", qrDark: "#052e16", qrLight: "#f0fdf4", Card: AuroraCard },
  { id: 2, name: "Blueprint", blurb: "Technical drawing", qrDark: "#0b2447", qrLight: "#e0f2fe", Card: BlueprintCard },
  { id: 3, name: "Brutal", blurb: "Neo-brutalist blocks", qrDark: "#111111", qrLight: "#ffffff", Card: BrutalCard },
  { id: 4, name: "Paper", blurb: "Letterpress print shop", qrDark: "#2b2620", qrLight: "#f7f3ea", Card: PaperCard },
  { id: 5, name: "Glass", blurb: "Frosted over neon blobs", qrDark: "#150e2e", qrLight: "#f5f3ff", Card: GlassCard },
  { id: 6, name: "Terminal", blurb: "Console green", qrDark: "#04120a", qrLight: "#4ade80", Card: TerminalCard },
  { id: 7, name: "Sunset", blurb: "Warm gradient sticker", qrDark: "#7c2d12", qrLight: "#fff7ed", Card: SunsetCard },
  { id: 8, name: "Editorial", blurb: "Magazine spread", qrDark: "#141414", qrLight: "#ffffff", Card: EditorialCard },
  { id: 9, name: "Neon", blurb: "Glow lines", qrDark: "#0d0221", qrLight: "#e0e7ff", Card: NeonCard },
];

export const CARD_W = 560;
export const CARD_H = 320;
