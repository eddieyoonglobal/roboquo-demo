# RoboQuo v15 — Ecosystem Directory & Expanded Categories

## What changed
- Robot taxonomy split into **Robot Types** and **Applications**.
- Added AMR/AGV, mobile manipulators, humanoids, quadrupeds, cleanroom/semiconductor, and warehouse robots.
- Added a seed directory of major manufacturers from Japan, Korea, China, Europe, and North America.
- Added regional manufacturer-office / dealer-network seed records.
- Added one RFQ concept: new equipment quotes, used-robot bidding, and service-project bidding.
- Added `robot-directory-seed.json` for future migration into a real database such as Supabase/PostgreSQL.

## Data policy
- This is a **seed directory**, not an exhaustive global database.
- RoboQuo should never display `Authorized Dealer` unless the manufacturer source confirms it or the manufacturer/dealer claims and verifies the profile.
- Manufacturer names and basic factual directory information can be seeded; inventory, pricing and claims of authorization should come from the company or verified official sources.
- Public phone/email should be optional. Keep inquiries inside RoboQuo where possible so transaction data and leads remain on-platform.

## Suggested live database tables
`manufacturers`, `robot_models`, `robot_types`, `applications`, `companies`, `company_territories`, `manufacturer_authorizations`, `listings`, `rfqs`, `bids`, `projects`, `translations`, `source_verifications`.
