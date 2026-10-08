import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Three typefaces do the heavy lifting across the ten templates:
// Fraunces for display serif moments, Space Grotesk for UI/grotesque cards,
// JetBrains Mono for the technical and terminal looks.
const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const body = Space_Grotesk({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Card Studio - Your people, one scan away.",
  description:
    "Design a social card that carries your whole identity: photo, links, and a QR code that saves you straight into someone's phone. Ten templates, printable or digital.",
};

export const viewport: Viewport = {
  themeColor: "#0b0b10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
