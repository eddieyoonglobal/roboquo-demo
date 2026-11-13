# RoboQuo approved maker-logo release (2026-11-14)

Source: user-reviewed local marketplace design. Merge only the approved logo size, manufacturer browsing and photo-truthfulness fixes into current GitHub main. Preserve all unrelated code, database, CI and recent language fixes.

- Existing maker cards: 29, authentic local mirrors in maker-logo-local-map.js.
- New robot maker cards: DOBOT/JAKA/ESTUN (China), Techman/HIWIN/Delta (Taiwan), Hanwha/Neuromeka (Korea), bringing total to 37.
- Source downloads: tools/sync-approved-maker-logos.py. The review branch syncs official original images to its assets folder, checks PNG decoding and stores SHA-256 provenance.
- Piab/AIDIN/PISCO: replace remote fallback with approved original cropped/visually corrected local assets. AIDIN whitespace only; PISCO original emblem only.
- Dark backgrounds for white Neuromeka, Koganei, Techman and ROBOTIS marks; proportional fanuc wordmark rendering.
- New seller listing without seller-uploaded image displays 'No seller photo'; labeled demos may retain illustrations.
- Existing buyer/seller data and integrations are untouched.
- Logo trademark display is nominative/reference use, not an affiliate/authorized distributor endorsement.
- Verify in staging and production that all 37 logos actually load and the supplier filters work in EN/KO/JA/ZH.
- Release requires no SQL migrations.
