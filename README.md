# RoboQuo v22 — Global Trade + Guided Procurement

This is the current GitHub/Vercel website build.

## Main updates
- Tokyo Supabase live database connection remains enabled.
- Language-based company priority remains: Japanese → Japan first, Korean → Korea first, English → Worldwide. Users can still switch to other countries.
- New **Build Your Solution** guided procurement flow: Robot → EOAT → Vision → Services → Logistics → Payment / RFQ.
- New **Guided Robot Listing** flow with autosaved draft, guided photo checklist, robot/nameplate/controller/pendant/cable/operating-hours/error capture, condition history, included equipment, dismantling and export logistics.
- Public auction wording is replaced by **Private Offer / Make Offer** terminology in the UI.
- New **RoboQuo One Vendor** concept section for reducing multi-supplier onboarding/payment administration.
- Existing global manufacturer, company, Where-to-Buy and robotics-event directory remains available.
- Japanese and Korean are prioritized for the new guided flows; other global languages fall back to English for new wizard-specific text until the dynamic translation backend is connected.

## GitHub update
Upload all files in this folder to the existing `roboquo-demo` repository and commit. Same filenames overwrite the old version. Vercel redeploys automatically.

## Important
Customer/company/listing data belongs in Supabase, not GitHub.
Never commit database passwords, Supabase secret/service-role keys, payment secret keys or mail passwords.
The browser publishable Supabase key in `supabase-config.js` is the public client key and is protected by RLS.

## Database
The country sales-company seed is supplied separately in the all-in-one package. It adds Japanese and Korean local sales entities such as FANUC Japan / Korea FANUC, YASKAWA Japan / Korea, Kawasaki Robotics Korea, Hyundai WIA, HD Hyundai Robotics and others.
