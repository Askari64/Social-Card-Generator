import QRCode from "qrcode";
import { buildVCard } from "./vcard";
import type { CardProfile } from "./profile";

// Render the vCard as a QR PNG data URL. errorCorrectionLevel "M" is the
// sweet spot: tolerant enough to survive print, small enough to stay
// scannable when the payload grows. Colors are themed per template.
export async function vcardQrDataUrl(
  p: CardProfile,
  dark = "#000000",
  light = "#ffffff"
): Promise<string> {
  return QRCode.toDataURL(buildVCard(p), {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 512,
    color: { dark, light },
  });
}
