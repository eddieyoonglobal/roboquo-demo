# RoboQuo v20 — Supabase Tokyo Connected

This version connects the static RoboQuo prototype to the Tokyo Supabase project using the browser-safe publishable key.

## Live tables
The site attempts to read these public tables on load:
- manufacturers
- companies
- events
- purchase_channels
- listings

If a table is empty or temporarily unavailable, the existing static directory seed remains as a fallback.

## Important security rule
`supabase-config.js` contains only the public project URL and publishable key. Never add a database password, `service_role`, `sb_secret_...`, or any other secret key to GitHub or browser code.

## Current limitation
Authentication and customer write operations are not moved to Supabase yet. Company registration, listing creation, bids and inquiries still use the prototype/local flow until Auth + write policies are wired in the next version.

## Deployment
Upload all files in this folder to the root of the existing `roboquo-demo` GitHub repository and commit. Vercel should redeploy automatically.
