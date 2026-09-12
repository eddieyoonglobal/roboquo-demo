# RoboQuo v24.2 — Instant language switching

## Fixed in v24.2
- Changing the language selector updates the whole page immediately. A manual refresh is no longer required.
- The top global hero headline is intentionally fixed in English: **Robots. Ready to trade.**
- Navigation, commerce UI, guidance and supporting copy continue to follow the selected language.
- Removed residual English labels from Japanese, Korean and Simplified Chinese UI where they were not intentional brand/technical terms.
- Localized Home/About and the About-page value headings.
- Japanese copy was checked for Japanese punctuation. Japanese sentences use `、` rather than the English comma `,`.
- Japanese font stack remains Hiragino Sans / Yu Gothic / Meiryo / Noto Sans JP.
- PWA cache version bumped so the new files replace the previous cached build.

## Deploy
Upload all files in this folder to the root of the existing GitHub repository and commit. Vercel will redeploy automatically.
