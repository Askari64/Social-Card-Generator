"use client";
// The form that feeds the card. Controlled inputs write straight into the
// CardProfile state; persistence happens in the page via localStorage.
import type { CardProfile } from "@/lib/profile";
import { SAMPLE_PROFILE, EMPTY_PROFILE } from "@/lib/profile";

interface Props {
  profile: CardProfile;
  onChange: (p: CardProfile) => void;
}

const FIELDS: { key: keyof Omit<CardProfile, "photo">; label: string; placeholder: string; type?: string }[] = [
  { key: "name", label: "Full name", placeholder: "Ada Lovelace" },
  { key: "title", label: "Role / title", placeholder: "Software Engineer" },
  { key: "company", label: "Company", placeholder: "Studio, Inc." },
  { key: "phone", label: "Phone", placeholder: "+91 98765 43210", type: "tel" },
  { key: "email", label: "Email", placeholder: "you@domain.com", type: "email" },
  { key: "website", label: "Website", placeholder: "yoursite.dev" },
  { key: "linkedin", label: "LinkedIn", placeholder: "in/yourname or URL" },
  { key: "instagram", label: "Instagram", placeholder: "@handle" },
  { key: "github", label: "GitHub", placeholder: "username" },
  { key: "twitter", label: "X / Twitter", placeholder: "@handle" },
];

// Downscale an uploaded photo to a 320px JPEG data URL - big enough for the
// card, small enough for localStorage and the QR-less vCard.
function fileToSmallDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 320;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function EditorForm({ profile, onChange }: Props) {
  const set = (key: keyof CardProfile, value: string | null) => onChange({ ...profile, [key]: value });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.14em", color: "var(--muted)" }}>
              {f.label}
            </span>
            <input
              type={f.type ?? "text"}
              value={profile[f.key]}
              placeholder={f.placeholder}
              onChange={(e) => set(f.key, e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-[14px] outline-none transition-colors"
              style={{ background: "var(--raised)", border: "1px solid var(--line)", color: "var(--fg)" }}
            />
          </label>
        ))}
      </div>

      {/* Photo: optional; templates fall back to a monogram without one. */}
      <div>
        <span className="mb-1.5 block text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.14em", color: "var(--muted)" }}>
          Photo (optional)
        </span>
        <div className="flex items-center gap-3">
          <label
            className="cursor-pointer rounded-lg px-3 py-2 text-[13px] font-semibold"
            style={{ background: "var(--raised)", border: "1px dashed var(--line)", color: "var(--fg)" }}
          >
            {profile.photo ? "Replace photo" : "Upload photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) set("photo", await fileToSmallDataUrl(file));
                e.target.value = "";
              }}
            />
          </label>
          {profile.photo && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
              <button onClick={() => set("photo", null)} className="text-[12px] underline" style={{ color: "var(--muted)" }}>
                remove
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onChange({ ...SAMPLE_PROFILE, photo: profile.photo })}
          className="rounded-lg px-3 py-2 text-[13px] font-semibold"
          style={{ background: "var(--raised)", border: "1px solid var(--line)", color: "var(--fg)" }}
        >
          Load sample
        </button>
        <button
          onClick={() => onChange(EMPTY_PROFILE)}
          className="rounded-lg px-3 py-2 text-[13px]"
          style={{ color: "var(--muted)" }}
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
