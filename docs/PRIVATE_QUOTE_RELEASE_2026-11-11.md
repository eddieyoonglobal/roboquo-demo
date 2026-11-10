# RoboQuo — Private Buyer Quote & On-Site Inspection MVP

Date: 2026-11-11 (JST). Status: implementation candidate, not a public production launch announcement.

## Value proposition

**高く売る。早く決まる。現地確認で安心。**
Real listing photos → private competitive purchase proposals → seller selects one → site visit → buyer verifies condition → offline payment and handover.

Unlike a public eBay/Mercari auction, each authenticated buyer's financial offer is visible only to that buyer and the actual owner. The seller can compare all proposals by amount and collection terms. No fake inventory or fake bids.

## Implemented

- Seller can choose default **multiple buyer quotes** or simple fixed-price listing when posting 1–8 actual photos.
- Each authenticated buyer may submit **one offer per published listing**, with amount in listing currency, proposed collection responsibility, short note and a check box accepting no additional on-site discount if condition matches.
- Seller-only received-offer comparison is sorted by offered price. Buyers have a separate private sent-offers view.
- Seller chooses **one** winning proposal. A partial unique Postgres index blocks competing awards during the selected, visit, inspection or completed states.
- **Prices and original terms cannot be edited** after proposal submission (database trigger). An ordinary buyer cannot forge seller decisions, and strangers cannot view quotes (RLS).
- Seller records planned site visit. Buyer confirms listing matched inspected goods. Seller records externally completed settlement and item handover; the listing is then marked Sold.
- Before buyer inspection acceptance, seller or buyer can cancel with a recorded reason in the case of mismatch or failed transaction.
- Original product photo gallery supports cover + up to seven additional seller photos, rather than generic brand photography replacing actual listings.
- English / Japanese / Korean buyer-facing quote and seller-facing comparison copy. Other UI languages currently fall back to English for this new workflow; other marketplace languages remain.

## Not implemented or promised

- **No processed payments, deposits, escrow, automated shipping or legally binding electronic signature.**
- **No fully automated buyer verification, dealer qualification, bid notifications or 48-hour countdown.**
- No site visit conducted by RoboQuo; the parties arrange and verify the actual equipment.
- Seller-reported final completion is an event record, not payment certification.
- No guaranteed best price or sale speed; without real buyer inventory and demand, competitive proposals may not arrive.
- Buyer company verification, dispute adjudication, independent inspection and localized legal terms must be defined before a paid or cross-border launch.

## Security and rollout

1. Source migration: `database/007_private_offer_visit_workflow.sql`.
2. Isolated Postgres tests: `tests/pg-private-quote-trade.sql`. Frontend fixture tests: `tests/private-quotes-regression.cjs`. Other seller + browser regression jobs retained.
3. Production project Supabase schema must include 004/005/006 before running 007. Apply through an authorized Supabase production migration only after staging CI succeeds; verify table grants/RLS afterward.
4. Preview environments must remain read-only against the production database. Test private offers with a separate staging Supabase DB before public launch.
5. Confirm exact intended Vercel project and Git commit. The historical live domain `roboquo.com` was linked to a Vercel project inaccessible via the current connector; do not reassign its custom domain to an unrelated deployment.
6. Mobile QA: actual seller photo → quote form → one offer per buyer → seller comparison → select a winner → schedule visit → buyer confirms match → seller records the off-site completion → SOLD listing.
7. For Japan: verify consumer/enterprise contract disclosures, tax, import/export and secondhand-dealer obligations with counsel where applicable.

**Japanese transaction principle (proposal, not an already-enforced legal contract):**
「掲載情報と実物の状態が一致した場合は、事前合意価格で取引し、現地での追加減額交渉は行わない。」
