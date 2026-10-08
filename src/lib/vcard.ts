import type { CardProfile } from "./profile";

// Normalize a handle or URL into a full https URL for a given network.
function toUrl(network: "linkedin" | "instagram" | "github" | "twitter", raw: string): string {
  const v = raw.trim().replace(/^@/, "");
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  const hosts = {
    linkedin: "https://linkedin.com/",
    instagram: "https://instagram.com/",
    github: "https://github.com/",
    twitter: "https://x.com/",
  } as const;
  return hosts[network] + v;
}

// vCard lines must escape , ; and newlines (RFC 6350).
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

// Build a vCard 3.0 payload. Kept lean on purpose: every byte makes the QR
// denser and harder to scan, so only populated fields are included and the
// photo stays out (it would blow past the scannable size instantly).
export function buildVCard(p: CardProfile): string {
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
  const full = p.name.trim() || "Unknown";
  const parts = full.split(/\s+/);
  const last = parts.length > 1 ? parts[parts.length - 1] : "";
  const first = parts.slice(0, parts.length > 1 ? -1 : undefined).join(" ");
  lines.push(`FN:${esc(full)}`);
  lines.push(`N:${esc(last)};${esc(first)};;;`);
  if (p.title.trim()) lines.push(`TITLE:${esc(p.title.trim())}`);
  if (p.company.trim()) lines.push(`ORG:${esc(p.company.trim())}`);
  if (p.phone.trim()) lines.push(`TEL;TYPE=CELL:${esc(p.phone.trim())}`);
  if (p.email.trim()) lines.push(`EMAIL;TYPE=INTERNET:${esc(p.email.trim())}`);
  if (p.website.trim()) {
    const w = p.website.trim();
    lines.push(`URL:${/^https?:\/\//i.test(w) ? w : "https://" + w}`);
  }
  (["linkedin", "instagram", "github", "twitter"] as const).forEach((net) => {
    const u = toUrl(net, p[net]);
    if (u) lines.push(`X-SOCIALPROFILE;TYPE=${net}:${u}`);
  });
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

// Trigger a .vcf download so the card can be shared as a contact file too.
export function downloadVcf(p: CardProfile) {
  const blob = new Blob([buildVCard(p)], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(p.name.trim() || "contact").replace(/\s+/g, "-").toLowerCase()}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}
