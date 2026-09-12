# RoboQuo v24.1 — Full language consistency fix

This is the latest commerce-focused RoboQuo website update.

## v24.1 changes
- Fixed the issue where Japanese/Korean navigation was localized but commerce sections remained in English.
- Added localized v24 commerce UI for all 10 supported languages:
  - English
  - 日本語
  - 한국어
  - 简体中文
  - Deutsch
  - Français
  - Español
  - Italiano
  - Português
  - Tiếng Việt
- Localized product cards, product detail view, cart, checkout, collaboration section, market headings and key page labels.
- Country names use the site's localized country labels where available.
- Existing Supabase sign-up/sign-in remains enabled.
- Existing events, company directory, manufacturers, search and seller wizard remain available.
- Updated PWA service-worker cache so `v24.css` and `v24.js` are included and the new language build is not masked by an older cache.

## Deploy
Upload all files in this folder to the root of the existing GitHub repository and commit the changes. Vercel will redeploy automatically.
