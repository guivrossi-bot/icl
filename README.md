# Industrial Cutting Labs — Main Site

React + Vite site for industrialcuttinglabs.com

## Stack
- React 18
- Vite 5
- No external UI libraries — pure inline styles
- i18n: EN / PT / ES with browser language auto-detection

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

## Deploy on Vercel

1. Push this repo to GitHub
2. Import project on vercel.com
3. Framework: Vite (auto-detected)
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add custom domain: industrialcuttinglabs.com

## Adding a new tool to Labs

Open `src/App.jsx` and add a new card inside `LabsPage` following the existing pattern.
Update the tool count stat in `HomePage` (currently set to `2`).

## i18n

All text lives in `src/i18n/translations.js`.
Add new keys to all three languages (en, pt, es) to keep translations in sync.
Language is auto-detected from `navigator.language` — PT for Portuguese browsers, ES for Spanish, EN as default.

## Key URLs (update in App.jsx if they change)

- NL_URL: LinkedIn newsletter
- LI_URL: Guilherme's LinkedIn profile
- IGNITE_URL: Path to the Ignite app (default: /labs/ignite)
