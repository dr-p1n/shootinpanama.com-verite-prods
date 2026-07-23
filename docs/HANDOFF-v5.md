# Shoot In Panama — session handoff (v5, updated 2026-07-23)

Paste this as the opening CONTEXT for a fresh chat.

## Project / infra
- Live site: https://www.shootinginpanama.com (Cloudflare Pages project `shootinpanama-verite`, account julioernestolv@gmail.com, wrangler authed). GitHub: dr-p1n/shootinpanama.com-verite-prods.
- Repo (shell DEFAULT cwd — do NOT `cd` to other similar paths; stale copies exist):
  `/Users/jelv/Desktop/backup 23.2.2026/DATRUM/DATRUM projects/shoot in panama :: VERITE`
- Branch `hero-cinematic` (HEAD `b73e373`, pushed + in sync with origin). Deploy: `npx wrangler pages deploy --branch main` (config from wrangler.toml, pages_build_output_dir="public"). Verify live with `?cb=$RANDOM`; www edge lags a deploy by ~1 min, the returned `*.pages.dev` deployment URL is authoritative.
- Single-page app: one `public/index.html` with `.page` sections (#page-home…#page-contact); `/es/` is the SAME html served via `_redirects` rewrite `/es/* -> /index.html`, translated client-side by `public/i18n.js` (walks body text nodes + swaps head tags). Asset paths are root-absolute (`/assets/…`) so they resolve under `/es/`.

## Lead capture (LIVE — full pipeline working end to end)
- `functions/api/lead.js` — POST /api/lead: validates (email required), honeypot ("website"), saves to KV (binding LEADS), then Sheet append, then Resend email. Timestamps in America/Panama (UTC-5).
  - **Email now sends branded HTML** (`renderHtml`) — near-black header with the official badge logo (hosted `/assets/logo-badge-256.png`), brand palette (ink #03060a / paper #EEECEA / accent #C9541E), numbered fields, brief callout, "Open all leads in Google Sheet" button. Georgia stands in for Fraunces (web fonts don't load in email). User input HTML-escaped via `esc()`. Plain-text (`renderText`) sent alongside as fallback. from=LEAD_FROM, to=LEAD_TO, reply_to=enquirer.
- `functions/api/leads.js` — GET /api/leads?token=… (KV read-back).
- Read leads: https://www.shootinginpanama.com/api/leads?token=ca227c8b4359c76216c36239690540a9
- wrangler.toml vars: LEAD_TO="rbarria@veriteproducciones.net", LEAD_FROM="Shoot In Panama <noreplymarketing@shootinginpanama.com>", SHEET_VIEW_URL=the sheet /edit#gid=1181426352. KV LEADS id 3d94515c1b3d4e70b7d983457fd33a47.

## Secrets / destinations status
- LEADS_TOKEN: SET (ca227c8b4359c76216c36239690540a9, rotatable).
- SHEET_ENDPOINT: SET + LIVE. Google Sheet (owner julioernestolv@gmail.com): https://docs.google.com/spreadsheets/d/10sjV8IIA6WPnuwGa-9gfrJdTdKAgtClQy7-4ICjALCA (data on the **Leads** tab, gid 1181426352). Every submission appends a row. **TODO: share the Sheet with rbarria@veriteproducciones.net** so the email button doesn't hit a request-access wall.
- RESEND_API_KEY: **SET + LIVE**. Domain shootinginpanama.com **verified** in Resend (us-east-1). Key name `shootinginpanama-lead-notifications`, Sending-access only. Test lead on 2026-07-23 confirmed `stored:true, emailed:true, sheeted:true` and rendered correctly (logo + layout) in Resend's preview.

## Alberto (client IT, +507 6334-8380, WhatsApp) — DONE
- Resend DNS added at Bluehost (verified live via dig): DKIM `resend._domainkey`, MX+SPF on `send`, `_dmarc`. Note: Alberto set DMARC stricter than requested (`p=quarantine; adkim=s; aspf=s`) — harmless (DKIM aligns strictly, DMARC passes); could relax to `p=none` if ever needed.
- Apex HTTPS→www redirect fixed in Bluehost `.htaccess` (verified: both http and https apex now 301 → https://www.shootinginpanama.com). Old VERITE.SERVICES site no longer served on no-www.
- **Still to do:** tell Alberto he's all set + thanks (and that `resend_api` was our Resend-dashboard step, not his — he was confused by the term).

## Done this session (2026-07-23) — all committed + pushed + deployed
- **Email HTML template** (`renderHtml` in lead.js) built, previewed, wired in, live. Commit `d3535a3`.
- **Location carousels expanded** with Ricardo's 16 photos from `location images/extended carrousel` (zip, no extension). Converted HEIC/JPG → 1920px JPG+WebP (sips + cwebp), EXIF-oriented, both formats per basename. Commit `b73e373`. New counts via `data-gallery`:
  - Caribbean Beaches 2→5 (Isla Cebaquito, Isla Cebaco, Playa Diablo/Fuerte Sherman)
  - Panama City 2→6 (Costa del Este, Panama City Point, Convention Center, Coastway Amador)
  - Rainforest & Jungle 1→6 (Los Quetzales, Rana Camino de Cruces, Camino de Cruces, Volcán Barú, Sendero Boquete)
  - Casco Viejo 7→11 (Sombreros, Santa Ana ×3)
  - (naming: appended `loc-<card>-N-full.jpg/.webp`; forest-3 is a genuine portrait)
- **Resend email path fully activated** (verify domain → create key → set secret → redeploy → test). See above.
- **Test-lead cleanup**: deleted the 2 email-test leads from KV (9→7 keys) and the matching Sheet rows 7–8.

## From prior session (still in place)
- Sheet backup, Panama timestamps, BTS gallery swap (car + crate portrait exception), /es/ absolute asset paths (fixed broken images), "Shoot 365 days (366 in leap years)" heading, SEO pass (58-char title, 150 desc, single H1, robots meta + X-Robots-Tag header, Spanish head tags, clean `/` home URL).

## Open / undecided
- **Body text size**: user said it "feels small, should be size 11"; base 15px, body renders ~12–14px (rem-based), so literal 11px would shrink it. Awaiting decision — nothing changed.
- **Older QA/test data still in Sheet + KV** (all pre-existing test rows, no real customer leads yet): Sheet rows for `DATRUM Tests`, `test`, `Timezone Test`, `TZ Confirm`, `julio/test`; plus KV keys incl. `wiring-test@example.com`, `tz2@example.com`. Offer to clear for a clean slate before Ricardo uses it.
- Optional: remove inert `keywords` meta (Google ignores it).

## Assistant constraints
Cannot create accounts or edit registrar/Bluehost DNS/hosting (Alberto's). CAN: all Cloudflare CLI (secrets, deploy, KV delete via `--remote`); drive Resend/Sheet dashboards in the connected browser after the user signs in; generate/convert images (sips/cwebp). Note: Google Sheets in the in-app browser needs care — canvas grid doesn't take keyboard input via automation and clicks land ~2× offset (calibrate: input ≈ screenshot_coord ÷ 2, and verify selection before any destructive click). KV captures every submission, so leads are never lost.
