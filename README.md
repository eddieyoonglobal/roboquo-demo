# RoboQuo v24.4 — Trust, photo-first UX, SEO and PWA

RoboQuo is a multilingual prototype for a global used-robot marketplace. The site is a static SPA deployed from GitHub to Vercel, with optional Supabase Auth and database integration.

## v24.4 highlights

- Added canonical, description, Open Graph, Twitter and structured-data metadata.
- Added `robots.txt`, `sitemap.xml` and a social sharing image.
- Removed prefilled sample values from the project form.
- Made the seller flow genuinely photo-first: at least one image is required, drafts keep local image previews, and locally published demo listings retain their photos.
- Clearly separated illustrative demo listings and quotes from live database data.
- Removed unsupported verification, nameplate, video and operating-hour claims from demo listings.
- Added localized Supabase Auth errors and a cross-device email-confirmation return path.
- Added relative source freshness labels for purchase-channel snapshots.
- Added focus management, dialog semantics, accessible labels and decorative-icon handling.
- Added PNG PWA icons and removed manual cache-version bumping from the service worker.
- Loaded the robot directory seed before optional live database data so static deployments remain functional.

## Local check

Serve this directory over HTTP (service workers and JSON seed loading do not work reliably from `file://`):

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy

Changes pushed to the repository's `main` branch are deployed automatically by Vercel.

## Prototype limits

- Hash routes are still used, so individual listing and manufacturer pages do not yet have indexable URLs. Dedicated routes plus SSR/static generation are the next SEO architecture step.
- Seller photos are stored in the current browser for the prototype. Production should upload them to Supabase Storage and associate them with server-side drafts.
- Payments and escrow are not implemented.
