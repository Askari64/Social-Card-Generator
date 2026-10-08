// The card owner's details. Everything the user types lives here and is
// persisted to localStorage - nothing ever leaves the browser.
export interface CardProfile {
  name: string;
  title: string; // role / job title
  company: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string; // handle or URL
  instagram: string;
  github: string;
  twitter: string; // X handle
  photo: string | null; // downscaled data URL, or null for no photo
}

// Demo data so every template looks alive before the user types a word.
export const SAMPLE_PROFILE: CardProfile = {
  name: "Askari Rizvi",
  title: "Software Engineer",
  company: "Studio Rizvi",
  phone: "+91 98765 43210",
  email: "hello@askari.dev",
  website: "askari.dev",
  linkedin: "in/askaririzvi",
  instagram: "@askari.codes",
  github: "Askari64",
  twitter: "@askari_dev",
  photo: null,
};

export const EMPTY_PROFILE: CardProfile = {
  name: "",
  title: "",
  company: "",
  phone: "",
  email: "",
  website: "",
  linkedin: "",
  instagram: "",
  github: "",
  twitter: "",
  photo: null,
};

const STORAGE_KEY = "scg:profile:v1";
const TEMPLATE_KEY = "scg:template:v1";

// Fill empty fields with the sample so previews never look broken.
export function withSample(p: CardProfile): CardProfile {
  const out = { ...p };
  (Object.keys(SAMPLE_PROFILE) as (keyof CardProfile)[]).forEach((k) => {
    if (!out[k]) (out as Record<string, unknown>)[k] = SAMPLE_PROFILE[k];
  });
  return out;
}

export function loadProfile(): CardProfile {
  if (typeof window === "undefined") return SAMPLE_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROFILE;
    return { ...EMPTY_PROFILE, ...(JSON.parse(raw) as CardProfile) };
  } catch {
    return EMPTY_PROFILE;
  }
}

export function saveProfile(p: CardProfile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // photo data URLs can exceed the quota - degrade silently, card still works
  }
}

export function loadTemplateId(): number {
  if (typeof window === "undefined") return 0;
  const n = Number(window.localStorage.getItem(TEMPLATE_KEY));
  return Number.isFinite(n) && n >= 0 && n < 10 ? n : 0;
}

export function saveTemplateId(id: number) {
  try {
    window.localStorage.setItem(TEMPLATE_KEY, String(id));
  } catch {
    /* ignore */
  }
}
