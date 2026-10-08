# Libraries and what each one is for

| Library | Used for |
| --- | --- |
| `next` (16) | App framework - App Router, static prerender, font optimization |
| `react` / `react-dom` (19) | UI runtime |
| `tailwindcss` + `@tailwindcss/turbopack` (4) | Utility styling for the studio chrome (forms, panels, layout) |
| `qrcode` | Renders the vCard payload into a themed QR PNG data URL (error correction M, per-template colors) |
| `html-to-image` | Rasterizes the live card DOM node into the downloadable 2x PNG |
| `framer-motion` | The header wordmark letter animation (the only motion; honors prefers-reduced-motion) |
| `next/font/google` | Fraunces (display serif), Space Grotesk (UI), JetBrains Mono (technical templates) |
| `typescript`, `eslint`, `eslint-config-next`, `@types/*` | Type safety and linting |

## What is deliberately NOT here

- **No backend, no database** - profiles persist in localStorage; nothing leaves the device.
- **No QR API** - codes are generated client-side, so the app works offline after load and there are no keys to manage.
- **No component library** - the ten templates are hand-built JSX so each one can be a genuinely different visual language. Small animation primitives live in `src/components/bits.tsx` in the react-bits spirit.
- **No photo hosting** - uploaded photos are downscaled to a 320px data URL and kept on-device (and never put inside the QR - that would make it unscannable).
