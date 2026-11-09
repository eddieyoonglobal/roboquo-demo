# RoboQuo — manufacturer-sourced cobot model comparison (2026-11-10)

The comparison widget is **reference-only**. It is not an inventory listing, a certification claim, an authorized seller, or an actual purchase quote. Manufacturer specs may differ by generation, controller, operating envelope, attachment and installation.

## Reviewed starter models

| Brand | Model | Payload (kg) | Reach (mm) | Axes | Manufacturer source |
|---|---|---:|---:|---:|---|
| Universal Robots | UR5e | 5 | 850 | 6 | [Official details](https://www.universal-robots.com/manuals/EN/HTML/SW10_8/Content/prod-usr-man/complianceUR5e/H_g5_sections/appendix_g5/tech_spec_sheet.htm) |
| Universal Robots | UR20-1750 (UR20) | 20 | 1750 | 6 | [Official details](https://www.universal-robots.com/manuals/EN/HTML/SW5_26/Content/prod-usr-man/complianceUR20/H_g5_sections/appendix_g5/tech_spec_UR20.htm) |
| FANUC | CRX-10iA | 10 | 1249 | 6 | [Official details](https://www.fanuc.co.jp/ja/product/robot/model/crx/lineup/crx-10ia.html) |
| Doosan Robotics | M0609 | 6 | 900 | 6 | [Official details](https://www.doosanrobotics.com/jp/product-solutions/product/m-series/m0609/) |
| Doosan Robotics | M1013 | 10 | 1300 | 6 | [Official details](https://www.doosanrobotics.com/jp/product-solutions/product/m-series/m1013/) |
| OMRON Robotics | TM5-900 | 4 | 900 | 6 | [Official details](https://robotics.omron.com/products/collaborative-robots/tm-series/tm5-900/) |
| JAKA Robotics | Zu5 | 5 | 954 | 6 | [Official details](https://www.jaka.com/profile/upload/2026/02/06/20260206103645A024.pdf) |
| JAKA Robotics | Zu7 | 7 | 819 | 6 | [Official details](https://www.jaka.com/jp/productDetails/JAKA_Zu7) |
| JAKA Robotics | Zu12 | 12 | 1327 | 6 | [Official details](https://www.jaka.com/profile/upload/2026/02/06/20260206103645A024.pdf) |
| FAIRINO | FR5 | 5 | 922 | 6 | [Official details](https://jp.fairino.com/FR/4.html) |

## Verification and limitations

- All rows must have a valid HTTPS manufacturer source; missing/unverified specifications are excluded, not filled with guesses.
- Payload is a reference nominal/baseline value, not a guarantee for a particular tool mass, center of gravity, speed, orientation or cycle. Include tooling mass in actual robot application calculations per manufacturer manual.
- Reach is a manufacturer-defined reach; confirm center and TCP reference conventions before purchasing.
- UR20 has been renamed **UR20-1750** with the 2026 Generation 7 platform (manufacturer notice: https://www.universal-robots.com/insights/faq/). The baseline is **20 kg**, while **25 kg is conditional** and is intentionally not used as the default comparable value.
- FAIRINO FR5 lists a standard rated payload of **5 kg** with **7 kg maximum** in its official source. This table uses 5 kg.
- OMRON TM5-900 is TM Series, not the TM S Series; model naming must stay distinct.
- Do not treat a robot with collaborative features as intrinsically safe: a machine/system risk assessment remains mandatory for each application.
- Product status (active/discontinued), official dealer status, pricing, stock, payload envelopes, and latest controller variants require separate checks.

## UI and isolation

- Ten-language interface, manufacturer filter, minimum payload, sort by payload/reach, and **up to three** selected models in side-by-side table.
- Entire widget is static client-side reading `cobot-specs.json`, no production Auth/Storage/Postgres access or writes.
- Source hyperlinks open manufacturer's own page with `noopener noreferrer`.
- Browser test uses fixture-only local server and intercepts external API calls; no live-account mutations.
- Production release must still validate separate Supabase migration, signup/upload/chat and Vercel project connection.
