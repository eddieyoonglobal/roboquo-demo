# RoboQuo v24.5 — Seller accounts and real listing submission

RoboQuo is a multilingual prototype for a global used-robot marketplace. The site is a static SPA deployed from GitHub to Vercel, with optional Supabase Auth and database integration.

## v24.5 highlights

- Added a private seller-contact step with company, contact person, business email, phone/WhatsApp, job title, website and preferred channel.
- Added authenticated listing submission to Supabase with a `pending` moderation state.
- Added private Supabase Storage uploads for seller photos and signed URLs for published listings.
- Added My RoboQuo listing management and owner-only listing/photo deletion.
- Kept personal contact details out of anonymous public queries; only the public company display name appears on a listing.
- Added `database/004_seller_marketplace.sql` with tables, grants, RLS, storage policies and seller/admin status controls.

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

For v24.5, apply `database/004_seller_marketplace.sql` once in the Supabase SQL Editor before testing seller submission. The migration is idempotent and does not modify the existing manufacturer, company, event, purchase-channel or legacy listing data.

Recommended order:

1. Open Supabase Dashboard → SQL Editor → New query.
2. Paste and run `database/004_seller_marketplace.sql`.
3. Upload/push the website files to GitHub and wait for the Vercel deployment.
4. Create a test account with an email address you control, confirm the email, submit a listing, then check My RoboQuo.
5. In Supabase Table Editor, change a reviewed listing from `pending` to `published` to make it publicly visible.

## Prototype limits

- Hash routes are still used, so individual listing and manufacturer pages do not yet have indexable URLs. Dedicated routes plus SSR/static generation are the next SEO architecture step.
- Before sign-in, seller photos and draft fields remain on the current device. After authenticated submission, they are uploaded to Supabase and the listing is stored server-side.
- Admin moderation currently uses the Supabase dashboard. A dedicated moderator screen is a later step.
- Payments and escrow are not implemented.
