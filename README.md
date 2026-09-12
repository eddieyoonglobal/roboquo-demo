# RoboQuo v24 — Commerce-first website update

This package contains the **v24 website update** for RoboQuo.

## What changed in v24

- Homepage changed from directory-first to **buy / sell commerce-first**
- Stronger hero section: **Buy Robots / Sell a Robot**
- New **product-style cards** with:
  - fixed-price / private-offer status
  - seller trust indicators
  - product detail modal
  - add-to-cart and buy-now actions
- New **Cart / Checkout** page prototype
- Existing **Supabase authentication** remains active for sign-up / sign-in
- Existing **events, companies, makers, search and wizard flows** remain available
- Kept compatibility with the v23 data structure

## Files

- `index.html`
- `styles.css`
- `v24.css`
- `app.js`
- `auth.js`
- `v24.js`
- `supabase-config.js`
- JSON seed files

## Deploy to GitHub Pages

1. Open your GitHub repository.
2. Upload and replace all files in the website root with this folder contents.
3. Commit the changes.
4. GitHub Pages will rebuild automatically.

## Notes

- Sign-up / sign-in uses your existing Supabase public configuration.
- The cart and checkout are **prototype front-end flows** for now.
- The live commercial workflow can later connect to payment, escrow, or invoice partners.


## v24 contact & collaboration update

Public contact addresses included in the site:

- Sales / trading: `sales@roboquo.com`
- Partnerships / collaboration: `partnerships@roboquo.com`
- General inquiries: `info@roboquo.com`

The homepage includes a dedicated collaboration section for manufacturers, dealers, system integrators, service providers, logistics companies and technology partners. The same contacts are also available in the site footer.
