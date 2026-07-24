# Shoot In Panama — session handoff (v6, 2026-07-23)

Paste this as the opening CONTEXT for a fresh chat. Supersedes v5.

## Project / infra
- Live: https://www.shootinginpanama.com (Cloudflare Pages project `shootinpanama-verite`, account julioernestolv@gmail.com, wrangler authed). GitHub: dr-p1n/shootinpanama.com-verite-prods.
- Repo = shell DEFAULT cwd (do NOT `cd` to other similar paths; stale copies exist):
  `/Users/jelv/Desktop/backup 23.2.2026/DATRUM/DATRUM projects/shoot in panama :: VERITE`
- Branch `hero-cinematic`, HEAD `40e030c`, pushed + in sync. Deploy: `npx wrangler pages deploy --branch main` (config wrangler.toml, output dir `public`). Verify live with `?cb=$RANDOM`; the returned `*.pages.dev` URL is authoritative (www edge lags ~1 min).
- SPA: one `public/index.html` (`.page` sections); `/es/` is the same file via `_redirects` rewrite, translated client-side by `public/i18n.js`. Assets are root-absolute `/assets/…`.

## Lead flow (LIVE end to end)
- POST /api/lead (`functions/api/lead.js`) → KV (binding LEADS) + Google Sheet append + Resend email. Panama-local timestamps (UTC-5).
- Email sends **branded HTML** (`renderHtml`) + plain-text fallback: official badge logo, brand palette (ink #03060a / paper #EEECEA / accent #C9541E), numbered fields, brief callout, "Open all leads in Google Sheet" button. from=LEAD_FROM, to=LEAD_TO, reply_to=enquirer. User input HTML-escaped (`esc`).
- Read-back: /api/leads?token=ca227c8b4359c76216c36239690540a9
- Secrets/vars all SET + LIVE: LEADS_TOKEN, SHEET_ENDPOINT, **RESEND_API_KEY** (domain shootinginpanama.com verified in Resend). LEAD_TO=rbarria@veriteproducciones.net, LEAD_FROM="Shoot In Panama <noreplymarketing@shootinginpanama.com>". KV LEADS id 3d94515c1b3d4e70b7d983457fd33a47. Sheet 10sjV8IIA6WPnuwGa-9gfrJdTdKAgtClQy7-4ICjALCA (Leads tab, gid 1181426352).
- Alberto (client IT) DONE: Resend DNS live, apex→www https redirect live. (Still: thank him.)

## Location carousels — how they work (for content updates)
- 6 `.loc-card` divs in index.html, each `data-gallery="basename1,basename2,…"`. app.js builds `/assets/<basename>.webp` (preferred) + `.jpg` (fallback) for a swipe lightbox with dot counter. Card thumbnail is a separate `<picture>` (`loc-<x>.jpg/.webp`), NOT the `-full` set.
- Full images: `loc-<card>-[N-]full.jpg` + matching `.webp`, ~1920px long edge, q≈82.
- **Current gallery counts** (after v6): Caribbean Beaches **8** (loc-beach-full,2..8), Panama City **6** (loc-city-full,2..6), Rainforest & Jungle **7** (loc-forest-full,2..7), Casco Viejo **11** (loc-casco-tower-full,loc-casco-2..11-full), Ports & Canal **3**, Airports & Hubs **3**.
- To add a photo: convert (recipe below) → name next index → drop jpg+webp in public/assets → append basename to that card's `data-gallery` → deploy.

## ⚠️ IMAGE ORIENTATION RECIPE (learned the hard way — follow exactly)
`sips` does NOT reliably honor EXIF orientation. Two failure modes bit us:
- `sips -Z` (resize/convert) **strips EXIF and bakes raw pixels** → phone photos with an orientation flag come out rotated/upside-down.
- `sips -r <deg>` **sets an EXIF flag instead of baking** → the JPG looks right in EXIF-aware viewers (and in the Read tool) but renders WRONG in browsers that ignore the flag; the webp (cwebp bakes) is fine, so the live site looked OK via webp while the jpg fallback was broken.

**Correct, deterministic pipeline (bakes pixels, no EXIF reliance):**
1. `sips -s format jpeg -Z 1920 -s formatOptions 82 "SRC" --out raw.jpg` (HEIC/HEIF/JPG → raw pixels)
2. Python + Pillow (PIL 12.1 installed; NO pillow-heif, so PIL can't open HEIC directly — that's why sips does step 1):
   `Image.open(raw).convert("RGB").rotate(ANGLE_CCW, expand=True).save(out,"JPEG",quality=82,optimize=True)`
   ANGLE_CCW is counter-clockwise: 180 for upside-down, 90 for "rotate left", 270 for "rotate right". 0 if already correct.
3. `cwebp -quiet -q 80 out.jpg -o out.webp`
4. **VERIFY by rendering the JPG in a browser** (getBoundingClientRect portrait check), not by `sips -g` (which reports EXIF-corrected dims and hides the bug). jpg and webp rendered dims must match.
Tools present: sips, cwebp, dwebp, python3+PIL. No ImageMagick, no pillow-heif.

## Done this session (v6) — committed + pushed + deployed
- Email HTML template built + live (commit d3535a3).
- Resend fully activated (verify → key → secret → redeploy → test).
- Extended-carousel: added 16 photos, then fixed 5 orientations, then added Ricardo's 3 islands + 1 jungle. Final counts above. Skipped duplicates: Isla Cebaquito, Sendero Los Quetzales, Casco Viejo General, Canal Gamboa, Boquete Lost Waterfalls, "playa palmeras Bocas", "Panama City.JPG" (all already present under other names).
- Test-lead cleanup: deleted 2 email-test leads from KV (`--remote`) + Sheet rows.

## OPEN ITEMS (for next session)
1. **Reply-to email issue (needs decision).** rbarria reports he "can't reply" to the notification. Verified in Resend the message IS correct: From noreplymarketing@shootinginpanama.com, **Reply-To = enquirer's email** (a compliant client replies to the prospect — working as designed). Likely cause: clients that ignore Reply-To send the reply to the `noreplymarketing@` From, which has **no inbound mailbox** (shootinginpanama.com has no receiving MX; only the `send` subdomain exists, for bounces) → bounce. Options: (a) confirm exact symptom with rbarria; (b) rename sender off "noreply"; (c) real fix = inbound routing for a monitored address (needs Alberto: MX, or Cloudflare Email Routing) so the From itself is replyable. NOT yet changed.
2. **Share the Google Sheet** with rbarria@veriteproducciones.net (so the email's Sheet button doesn't hit a request-access wall).
3. Older QA/test rows still in Sheet + KV (DATRUM Tests, test, Timezone Test, TZ Confirm, julio/test, wiring-test, tz2) — offer to clear for a clean slate.
4. Body-text-size decision (user said "size 11"; base 15px renders ~12–14px, literal 11px shrinks it) — awaiting call, nothing changed.
5. Tell Alberto he's all done + thanks.

## Assistant constraints / gotchas
- Can't create accounts or edit Bluehost/registrar DNS (Alberto's). CAN: all Cloudflare CLI (secrets, deploy, `kv key … --remote`), drive Resend/Sheet dashboards in the connected browser after user signs in, convert images (sips/cwebp/PIL).
- **Google Sheets in the in-app browser**: canvas grid ignores injected keyboard events, and clicks land ~2× offset (input ≈ screenshot_coord ÷ 2). Select rows via row-header clicks, VERIFY the selection ("Count:"/menu label) before any delete.
- KV captures every submission, so leads are never lost.
