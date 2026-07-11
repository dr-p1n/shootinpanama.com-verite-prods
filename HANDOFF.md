# Handoff — Verite Producciones "Shoot In Panama" website (v3)

Marketing website for **Verite Producciones** ("Shoot In Panama"), a full-service **film-production
services company in Panama** for international productions (crew, permits, locations, logistics,
incentives). Owner's **first film-industry client** — bar is "exceptional." Client-facing demo/proposal.
The client's CEO reviews and gives notes; honor them precisely.

## ★ Chosen direction (A/B resolved)
- **Cinematic + editorial theme is the site** → https://hero-cinematic.shootinpanama-verite.pages.dev
  (moody backlit cinematographer Home hero + editorial theme). The client picked this direction.
- **`hero-clapperboard` was DELETED** (local + remote) — "we are only using [one] deployment." Its
  preview alias `hero-clapperboard.shootinpanama-verite.pages.dev` may linger until its Pages
  deployments are purged (Cloudflare dashboard, or `wrangler pages deployment delete`).

## Workflow / branch discipline (IMPORTANT)
- Single file: **`public/index.html`** (static SPA; `showPage(id)`; the JS `pages` array must match the
  mobile-link order). `public/_headers` holds the CSP — keep `connect-src ... https://api.open-meteo.com`
  (live weather).
- **Single working branch now: `hero-cinematic`.** No more cherry-picks. Commit → deploy that branch.
  The editorial CSS lives in a clearly-marked block at the end of `<style>` ("EDITORIAL THEME").
- Deploy: `wrangler pages deploy public --project-name shootinpanama-verite --branch hero-cinematic --commit-dirty=true`.
- `main` auto-deploys to https://shootinpanama-verite.pages.dev but is **STALE**. Open question: promote
  `hero-cinematic` → `main` to make it the production URL (ask client / confirm before doing so).

## Infra
- Cloudflare Pages project `shootinpanama-verite`, account `julioernestolv@gmail.com`
  (id `2b29809d1391e748856d98e409edaf0d`). `wrangler` authed. Repo GitHub
  `dr-p1n/shootinpanama.com-verite-prods` (`gh` authed as `dr-p1n`).
- Domain `shootinpanama.com` NOT registered (client owns `veriteproducciones.net`).
  `scripts/set-domain.sh <domain>` rewrites canonical/OG/JSON-LD at cutover.
- Contact: Ricardo Barria · rbarria@veriteproducciones.net · +507 6612-7525.

## Pages (SPA tabs)
Home · Work · Services · **Government Incentives** · Resources · Contact.

## What's built
- **Home (offerings-first):** full-bleed hero → **"What We Do"** offerings index (Production Services /
  Fixer & Logistics / Executive Compliance / Government Incentives, each links onward)
  → a single **teaser** that leads on the firm's experience (**"Over 30 years making Panama work on
  camera."**) then a light **"Why Panama?"** line with inline links into Services/Incentives. (The
  Production Link International "As featured in" backlink was **REMOVED** per CEO — relationship ended.)
- **Work:** monochrome **logo wall** (drop-in SVG marks: MrBeast wordmark, CBS, NBC, MTV, Netflix,
  Discovery wordmark) → last tile "The Complete Reel · Available Upon Request" (→ Contact). Credits are
  the **CEO-authorized list only**: CBS's The Amazing Race, NBC's Today Show (Where in the World is Matt
  Lauer?), MTV's The Challenge, Netflix's ARP, Discovery's Survive the Raft, MrBeast; credits roll adds
  Miss Universe 2003, Survivor vs Survivalist, beer-brand commercials, OAS. **English uses OAS (not
  OEA).** Then **"From The Set"** 3-column **contact sheet** of 15 real BTS stills with a lightbox.
- **Services:** 3 disciplines → stats band → an **Incentives teaser** with a CTA to the Incentives tab
  → Locations grid → live **Open-Meteo weather** + season copy.
- **Government Incentives (own tab):** Film Law 16 · 25% cash rebate · 0% duty · single-window ·
  $150/wk · 4-step process · what-qualifies / fine-print / worked example.
- **Resources:** gated **pre-production/educational guides** (producer's field guide, 25% rebate
  explained, location lookbook, 90-days-to-camera checklist, budgeting starter, carbon-negative
  briefing). "Download" opens a **lead-capture gate** (name/email/company) — currently a **`mailto:`
  hand-off** (see Pending: Google Sheet).
- **Real Verite imagery:** client's 27-shot BTS catalog in `verite - bts caatlog/` (iPhone HEIC). 15
  curated → `assets/bts01..15` (thumb `-t` + full, WebP+JPEG), converted with `sips` (orientation
  baked) + `cwebp`.
- **Logo/brand:** client's circular badge (`WhatsApp Image 2026-07-08…jpeg`, 864²) circle-masked to
  transparent → nav (90px / 68 scrolled) + all footers (136px); favicons 16/32/48 + 180px apple-touch;
  **1200×630 OG card** (`assets/og-card.jpg`) drives og:image/twitter:image; logo added to JSON-LD
  Organization. Source was opaque JPEG — a transparent PNG/SVG from the client would sharpen edges.
- SEO (OG, Twitter, canonical, JSON-LD), mobile hamburger nav, security headers.

## Cinematic editorial theme (cinematic branch only)
Removes decorative **section-divider hairlines** (why/inc/bts/service-row/page-header/footer/offerings),
**de-glasses the stats band** into open display type, widens spacing — whitespace + the numbered
hierarchy carry structure. Clapperboard keeps the ruled/boxed look as the contrast.

## Design language
Palette `--ink #03060a` / `--paper #EEECEA` / `--accent #C9541E`, teal shadows. Type **Fraunces**
(italic serif) + **DM Sans**. Dark, editorial, modern-luxury, real photography, restraint, spatial
alignment. Client likes discretion/NDAs and detailed rebate info.

## Client / CEO preferences (honor)
- Hero MUST be full-bleed, photorealistic, cinematic. REJECTED: CSS "slate" gimmick, plain skyline.
- Logo must have presence / be readable (why it's large now).
- Firm experience = **"over 30 years / Since 1993"** (client's approved commercial branding; updated
  from the earlier "25 years" placeholder). Keep the teaser a teaser. **No** Production Link backlink.
- Always use the full name **"Verite Producciones"**. English uses **OAS** (not OEA).
- Positioning line (Home offerings + Services header): **"the executive arm of your production"** — the
  executive branch so the client's creative/production team stays on the creative.
- Incentives fine print: **no** annual/per-project cap; payout can take **up to 3 years**; credit the
  most experienced Cash Rebate accountants/auditors.
- Never push experiments to `main` without client OK.

## Pending / next steps
1. **Bilingual EN/ES** (CEO wants it; not started). Planned mechanism: `data-i18n` dictionary + a small
   EN/ES nav toggle, `localStorage` persistence, `<html lang>` swap; draft Panama/neutral-LatAm Spanish
   for the whole site, flagged for CEO review. **BLOCKED on one decision: default language** (recommend
   English default w/ toggle). ~150–200 strings, single branch.
2. **CEO-pending assets** (all current hero images are **Unsplash placeholders** — swap for owned):
   - **Home page-1 hero** — cinematic = cinematographer photo; clapperboard = clapperboard photo
     (the "slate" the CEO flagged). Both are stock; need owned imagery.
   - **Get in Touch hero** = colorful on-set clapperboard (Unsplash stand-in). **Incentives hero** =
     Panama Canal (Unsplash stand-in). Both new this round; swap for owned/exact when available.
   - **Gallery:** BTS slots 5,7,8,13,14,15 replaced from the client's `new selection/final cut`
     folder (HEIC/JPEG → sips+cwebp, bts13/14 rotated 90° CW). Remaining swaps as CEO specifies.
   - **OAS conference screenshot** (CEO sending) → add to visuals.
   - **Beer-brand commercial images** (being sourced).
   - Official **show logos/screenshots** for the aired authorized productions (currently network SVG
     marks stand in on the Work grid).
3. **Wire the Resources download gate to a Google Sheet** (client chose Sheets). Google Apps Script
   Web App (`doPost` → append row); form POSTs form-urlencoded `no-cors`; add
   `https://script.google.com https://script.googleusercontent.com` to `_headers` connect-src; keep
   mailto fallback. Needs the client's Apps Script `/exec` URL.
4. **Client picks a THEME** (editorial vs ruled/boxed — not the hero; the two share aspects) → merge
   that branch to `main`. Compare via the two live URLs directly.
5. Custom-domain decision.

## Gotchas
- Edit `public/index.html` only. Keep cinematic-only theme changes OFF clapperboard.
- Live weather needs the Open-Meteo CSP entry.
- Preview screenshot intermittently returns black — start a **fresh** preview server; else verify via
  DOM (`preview_eval`). Fresh preview tabs can start at **0×0 or reset on reload** — `preview_resize`
  to explicit 1280×840 before measuring/screenshotting.
- After deploy, edge can serve a **stale** copy briefly — verify with a `?cb=$RANDOM` cache-buster.
- Images: `sips` + `cwebp`, no ImageMagick; review candidates via a Python/PIL contact sheet.
