# RoboQuo v21 — Japan Legal Names + Global Robotics Events

This build upgrades the manufacturer directory and events database while keeping the Tokyo Supabase connection.

## Key changes
- Japanese UI displays verified Japanese legal company names (株式会社 etc.) with English legal names/brands alongside them.
- 151 global robot / EOAT makers are seeded through the database seed file.
- Events include date, city, venue, organizer, previous attendance/exhibitors/booths/area where officially available.
- Attendance that represents co-located shows is explicitly labeled; it is not presented as a single-show attendance figure.
- iREX 2027 is shown as “early December 2027” because exact dates have not yet been announced.
- Global search matches Japanese and English manufacturer names and event names.
- Tokyo Supabase remains the system of record; GitHub/Vercel files remain presentation/code only.

## Run these SQL files in Supabase SQL Editor (in order)
1. `database/003_roboquo_i18n_event_upgrade.sql`
2. `database/004_global_manufacturers_full_seed.sql`
3. `database/004b_japan_manufacturer_localizations.sql`
4. `database/005_global_robotics_events_seed.sql`

Then upload the website files in this folder to the existing GitHub `roboquo-demo` repository and commit. Vercel will redeploy automatically.

Do not put database passwords, service-role keys, or secret keys in GitHub.
