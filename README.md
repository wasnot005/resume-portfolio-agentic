
# Resume → Portfolio (Gemini)

A Vite + React + TypeScript + Tailwind prototype that:
- Lets a user upload a resume (PDF/DOCX/TXT/JSON)
- Uses **Google Gemini** (client REST) to normalize & polish into a portfolio schema
- Renders a live portfolio preview
- Exports a **static site** as a ZIP (plain HTML + CSS)

> ⚠️ Prototype note: Calling Gemini from the browser exposes your API key. Use only for local testing. For production, proxy via a serverless function and store the key as a server secret.

## Quick Start

```bash
npm i
npm run dev
```

- Open http://localhost:5173
- Paste your Gemini API key (not stored)
- Upload a resume
- Preview the portfolio
- Click **Export Static Site (.zip)** to download a shareable static site

## Tech

- React 18, TypeScript, Vite
- Tailwind (tokens via CSS variables)
- pdfjs-dist (PDF text), mammoth (DOCX raw text)
- zod (schema validation)
- JSZip + file-saver (export)

## Security

Do **not** hardcode API keys in the client bundle. Prefer a server-side proxy (Vercel/Netlify function). This prototype uses a text field for dev convenience only.
