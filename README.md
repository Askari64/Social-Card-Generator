# Card Studio (Social Card Generator)

Design a social card that carries your whole identity - photo, role, links, and a QR code that saves you straight into someone's phone as a contact. Pick from 10 templates, then take the card anywhere: PNG for digital, print for physical, or a .vcf contact file.

## What it does

- Fill in your details (name, role, company, phone, email, website, LinkedIn, Instagram, GitHub, X, optional photo)
- Pick one of 10 distinct templates: Onyx, Aurora, Blueprint, Brutal, Paper, Glass, Terminal, Sunset, Editorial, Neon
- Every picker thumbnail is a live render of the actual card with your details and a real QR code
- The QR encodes a vCard 3.0 - scanning it with any phone camera offers "Add to contacts"
- Export: 2x PNG download, true business-card-size print (3.5in x 2in), .vcf download, or copy the raw vCard
- Everything stays in the browser: localStorage persistence, no account, no server, nothing uploaded

## Run it

```bash
npm install
npm run dev   # http://localhost:3000
```

No API keys, no environment variables.

## How it's put together

```
src/
  app/            layout (fonts, metadata), page (the studio), globals.css (tokens + print rules)
  lib/
    profile.ts    CardProfile type, sample fill, localStorage load/save
    vcard.ts      vCard 3.0 builder (RFC 6350 escaping) + .vcf download
    qr.ts         vCard -> themed QR PNG data URL
    templates.tsx the ten card faces, one component each, 560x320 design canvas
  components/
    CardStage.tsx     renders a template at exact canvas size; exporter captures this node
    TemplatePicker.tsx all ten cards rendered live in miniature
    EditorForm.tsx    the details form + photo downscale-to-data-URL upload
    ExportBar.tsx     PNG / print / .vcf / copy
    bits.tsx          header wordmark animation (reduced-motion aware)
```

Design decisions:

- The studio chrome stays neutral dark so the templates own the color.
- Cards are designed on a fixed 560x320 canvas (business-card ratio) and scaled with CSS transforms - the PNG exporter rasterizes the same node at 2x, so preview, download, and print are pixel-identical.
- The QR encodes only what the user typed (never sample filler); empty preview fields show sample text so templates never look broken.
- Print uses a dedicated `@media print` copy of the card at physical 3.5in x 2in with zero margins.
