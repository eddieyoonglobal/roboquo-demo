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

## November 2026 seller-flow verification (development branch only)

The seller marketplace uses the Supabase project configured in `supabase-config.js`.
In the current configuration this is the **live database**. Development URLs
(including Vercel Preview and localhost) are intentionally **read-only for new
account creation and seller submissions** while they point at that live database.
This is a browser-side guard to avoid accidental test records, not an access
control substitute; Supabase RLS remains authoritative.

To run isolated registration and upload tests, first configure a **separate
staging Supabase project** with the seller schema, private `listing-photos`
bucket and matching published/owner RLS policies, then change the browser
publishable URL/key in the staging build only. Allow-list the staging site's
URL under **Authentication → URL Configuration → Redirect URLs**.

No test accounts, listings, seller contact data, storage uploads or production
database changes are required for the following mocked checks:

```sh
node tests/seller-marketplace-regression.cjs
node tests/transaction-integrity-regression.cjs
node tests/preview-isolation-regression.cjs
node tests/buyer-inquiry-regression.cjs
```

Before promoting any changes: verify signup email confirmation, photo upload,
`draft → pending` submission, moderator publication, signed photo display,
owner-only deletion, condition labels and buyer inquiry on the staging project.
The checkout and invoice views are **informational only**; RoboQuo does not yet
process payment, issue invoices or operate escrow. Do not present cart subtotal
as a payable amount or advertise a platform fee without approved terms.

For production readiness, review Supabase Security Advisor notices and assess
database function permissions using an authorized database administrator.

Buyer inquiries currently open a prefilled email to `sales@roboquo.com` with the listing reference. The site itself does **not** transmit an inquiry or payment. A formal buyer-to-seller messaging workflow requires a separate reviewed backend and privacy policy.

## Seller schema verification and moderation hardening (2026-11-09)

- `database/004_seller_marketplace.sql` is the original seller schema.
- `database/005_seller_moderation_integrity.sql` is a **proposed forward-only patch** that prevents sellers from editing reviewed listings or removing approved media, requires contact and photo metadata before draft-to-pending submission, and restricts Storage uploads to an owner's draft listing folder.
- **005 is committed only to this development branch. It has NOT been applied to the operating Supabase database.** Test it on a properly isolated staging database and review seller deletion, moderation and storage behavior before any production migration.
- As of November 9, 2026, the connected operating Supabase project reported **zero tracked migrations** and no staging branches. The repository only contains a seller-specific baseline (004), not the full directory/event/company database baseline. Simply branching Supabase would not reliably recreate the entire application. Avoid incurring development branch compute charges until a complete migration history is established.
- GitHub Actions runs both SQL files against an **ephemeral PostgreSQL 17 service** with simulated Supabase roles and storage policies. It verifies public listings, private contacts, seller status restrictions and approved photo protection without writing to Supabase.
- `tests/pg-supabase-bootstrap.sql` and `tests/pg-seller-marketplace-smoke.sql` are CI fixtures, **not** production database bootstrap or real Supabase Auth tests.
- The complete signed-up user → photo upload → moderator approval flow still requires a separate staging Supabase environment and an allow-listed Preview auth redirect URL. The frontend Preview guard prevents accidental production write actions but is **not server-side authorization**.


## Real used robots & parts marketplace MVP — November 9, 2026

**Direction:** RoboQuo is now being rebuilt as a real classifieds marketplace,
not a sample robot catalog. Browse and search shows **seller-posted listings
only**; illustrative demo cards are excluded from market, featured and global
product-search results. No products or seller prices are invented.

### Buyer journey
1. Search real used robots, grippers, EOAT, controllers, vision equipment, robot
   spare parts and other accessories by type, brand, model or location.
2. Open an actual listing to see its seller-provided photos, price, condition
   and description.
3. Sign in, send a private message or negotiate a price with the seller.
4. Reopen conversations from **Messages / 내 채팅 / 取引メッセージ**.
5. Agree on payment, inspection and shipping **outside RoboQuo** for now.
   **RoboQuo does not process payments, hold deposits, operate escrow, or
   guarantee seller identity or item condition.**

### Seller journey
1. Open **Post an item / 상품 등록 / 商品を出品**.
2. Select robot or part category and condition; add 1–8 original photos, model,
   maker, price, location, description and private seller contact information.
3. Authenticate and confirm ownership. On a migrated production/staging DB,
   the listing is **published immediately after valid photo upload**.
4. Buyers can message the seller privately. The seller can mark the item **sold**
   or delete it from their account page.

### Database rollout required before any live release
The application code and new SQL are committed **only to the development
branch**, not applied to the operating Supabase project.

- Apply `database/004_seller_marketplace.sql` and
  `database/005_seller_moderation_integrity.sql` on a **new isolated staging
  environment**, followed by
  `database/006_real_classifieds_marketplace.sql`.
- The live Supabase project has an existing 004 schema but does not yet contain
  the 006 category/description/chat tables. Do **not** merge/deploy this release
  before applying and verifying the migration.
- CI tests all three SQL files in ephemeral PostgreSQL; it verifies immediate
  publication of a synthetic gripper listing and private buyer-to-seller
  messages, including outsider denial.
- For staging browser test, use a separate Supabase publishable URL and key
  configured in the staging build, plus approved Auth redirect URL(s).
  The current development Preview intentionally blocks all **write operations
  against the operating Supabase database**.
- Review anti-spam controls, moderation/reporting, image content safety,
  seller terms, transaction disputes and legal requirements before an open
  public marketplace launch.
- This first release is a **direct-message classifieds service**, not a
  payment-enabled e-commerce storefront. Do not call it an integrated checkout
  or escrow service.

### Automated tests
The GitHub Actions workflow runs JavaScript checks, headless Chromium
marketplace/search/posting smoke tests and PostgreSQL RLS tests, with isolated
in-memory test listings. CI screenshots are kept for seven days.

