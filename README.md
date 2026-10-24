# Haven & Form

A **fictional** premium interior design and furniture studio. This is a portfolio demonstration for an App and Web Developer interview at an advertising and branding agency — not a real company, not client work, and not a live shop.

## Features

- Editorial marketing site with sticky navigation, mobile menu, and a consultation CTA
- Project gallery with search, category filters, and detail pages
- Furniture shop with INR prices, sort, wishlist, cart, and empty states
- Demo checkout that creates an enquiry (no payments, no fake charges)
- Contact form with client-side validation, success toast, and generated reference
- Admin dashboard (labelled demo access) for enquiries, products, and projects
- Persistence via `localStorage` in this browser only
- 404 page, SEO titles, accessible forms, and Vitest coverage for validation and cart logic

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Public homepage |
| `/projects`, `/projects/:slug` | Gallery and project detail |
| `/shop`, `/shop/:slug`, `/shop?saved=1` | Catalogue, detail, wishlist |
| `/cart` | Demo bag and quote CTA |
| `/about` | Fictional studio story |
| `/contact` | Enquiries |
| `/case-study` | Problem, solution, stack, features |
| `/admin` | Demo dashboard (code printed on the gate: `haven-demo`) |
| `/admin/enquiries`, `/admin/products`, `/admin/projects` | Sample ops CRUD |

## Architecture

```
src/
  components/     layout, cards, shared UI
  context/        AppProvider (state + toasts)
  data/seed.ts    labelled sample content
  lib/            reducer, validation, formatters
  pages/          public + admin routes
  types.ts        shared TypeScript models
```

State lives in a reducer (`src/lib/store.ts`) and is written to `localStorage` under `haven-form-demo-v1`. Refreshing the public shop or the dashboard reads the same snapshot.

## Limitations

- No backend, no shared database, no authentication
- The admin gate is **not** security — the code is displayed on purpose
- WhatsApp uses a **placeholder** number in `src/lib/constants.ts` (`919000000000`)
- Remote Unsplash images require network access; a local SVG fallback is used on error
- Testimonials, leads, and metrics are sample/demo content

## Setup

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

## Testing

```bash
npm test
```

Watched mode: `npm run test:watch`.

## Production build

```bash
npm run build
npm run preview
```

## Vercel

This is a static Vite SPA. `vercel.json` rewrites all paths to `index.html`.

1. Push the project to GitHub (or import the folder in the Vercel dashboard).
2. In [Vercel](https://vercel.com/new), import the repository.
3. Framework preset: **Vite**. Build command: `npm run build`. Output: `dist`.
4. Deploy. No environment variables are required.

CLI alternative, from this folder:

```bash
npx vercel
```

Accept the defaults. Production:

```bash
npx vercel --prod
```

## Replaceable demo details

- WhatsApp: `WHATSAPP_PLACEHOLDER_E164` in `src/lib/constants.ts`
- Seed rooms, products, and enquiries: `src/data/seed.ts`
- Reset everything from the dashboard **Reset sample data** control
