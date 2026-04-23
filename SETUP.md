# Setup Guide

This portfolio is now a simple standalone Next.js project in the repo root.

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer

Check your versions:

```bash
node -v
npm -v
```

## Install

From `C:\OPT prep\website\portfolio`, run:

```bash
npm install
```

## Start The Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm run start
```

## Type Checking

```bash
npm run typecheck
```

## Main Project Files

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  ui/
    interactive-neural-vortex-background.tsx
    spotlight-card.tsx
package.json
tailwind.config.ts
tsconfig.json
```

## Customizing The Portfolio

Update these placeholders in `app/page.tsx`:

- `YourName`
- `your.email@example.com`
- `linkedin.com/in/your-name`
- `github.com/your-name`

You can also replace the project descriptions, stats, and skill lists in the same file.

## Notes

- The older `next-monorepo/` folder is still present as a reference, but the active app is the root project.
- The root project has already been verified with `npm run typecheck` and `npm run build`.
