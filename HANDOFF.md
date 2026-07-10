# Handoff — Verite Producciones "Shoot In Panama" website (v3)

Marketing website for **Verite Producciones** ("Shoot In Panama"), a full-service **film-production
services company in Panama** for international productions (crew, permits, locations, logistics,
incentives). Owner's **first film-industry client** — bar is "exceptional." Client-facing demo/proposal.
The client's CEO reviews and gives notes; honor them precisely.

## ★ Two proposals (A/B)
- **Cinematic** → https://hero-cinematic.shootinpanama-verite.pages.dev — moody backlit
  cinematographer-with-camera Home hero **+ an editorial theme** (see below).
- **Clapperboard** → https://hero-clapperboard.shootinpanama-verite.pages.dev — darkened clapperboard
  macro Home hero, keeps the original **ruled/boxed** theme.
The branches now differ by **two things**: (1) the Home hero image, and (2) the cinematic-only
**editorial theme CSS**. Everything else (copy, structure, imagery) is shared.

## Workflow / branch discipline (IMPORTANT)
- Single file: **`public/index.html`** (static SPA; `showPage(id)`; the JS `pages` array must match the
  mobile-link order). `public/_headers` holds the CSP — keep `connect-src ... https://api.open-meteo.com`
  (live weather).
- Shared changes → commit on **`hero-cinematic`**, then `git cherry-pick -x <sha>` to
  **`hero-clapperboard`**. Cherry-picks can conflict on the head **OG/hero image lines** (branches
  differ there) — resolve to the shared/new value.
- **Cinematic-only theme** changes → commit on `hero-cinematic` ONLY, do **not** cherry-pick. The
  editorial CSS lives in a clearly-marked block at the end of `<style>` ("EDITORIAL THEME · CINEMATIC
  BRANCH ONLY").
- Deploy a preview: `wrangler pages deploy public --project-name shootinpanama-verite --branch <b> --commit-dirty=true`
  (deploy BOTH branches after shared changes; only cinematic after theme changes).
- `main` auto-deploys to https://shootinpanama-verite.pages.dev but is **STALE** — don't touch without
  client OK.

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
  Fixer & Logistics / Executive Compliance / Government Incentives, numbered 01–04, each links onward)
  → a single **teaser** that opens with **"As featured in Production Link International ↗"** — a
  follow **backlink** to `https://www.productionlinkint.com/countries/panama/` (new tab) — then leads on
  the firm's experience: **"Over 25 years making Panama work on camera."** The old long narratives (Hub
  of the Americas / Carbon Negative / Discretion) were condensed into this one teaser.
- **Work:** selected-work grid (MrBeast in the lead slot) → **"From The Set"** 3-column **contact
  sheet** of 15 real Verite BTS stills (uniform, 1.5rem gaps) with a **click-to-enlarge lightbox**
  (prev/next, ← →, click-advance, Esc/backdrop, "NN / 15", neighbour preload).
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
- Teaser copy = firm experience ("over 25 years"), with the source credited as **"As featured in…"**
  (not an "article" subheader), linking out in a new tab. Keep it a teaser.
- Never push experiments to `main` without client OK.

## Pending / next steps
1. **CEO comparison deliverable** (asked, not built): a tab-by-tab **cinematic vs clapperboard**
   side-by-side, "instead of a Loom." Best path: headless full-page capture of each tab on both live
   URLs (SPA hash routes `#work`, `#services`, `#incentives`, `#resources`, `#contact`) montaged into
   one shareable page/Artifact. NOTE: the in-app preview `screenshot` tool is flaky (returns black; a
   fresh server sometimes fixes it) and its images can't be embedded into an Artifact — use a real
   headless capture to files.
2. **Wire the Resources download gate to a Google Sheet** (client chose Sheets). Plan: Google Apps
   Script Web App (`doPost` → append row); form POSTs form-urlencoded `no-cors`; add
   `https://script.google.com https://script.googleusercontent.com` to `_headers` connect-src; keep
   mailto as fallback. Needs the client's Apps Script `/exec` URL.
3. Finish shortening the **Resources card copy** (3 of 6 trimmed).
4. **Client picks a hero** → merge that branch to `main`.
5. Custom-domain decision; optional real client-logo strip / full client list on Work.

## Gotchas
- Edit `public/index.html` only. Keep cinematic-only theme changes OFF clapperboard.
- Live weather needs the Open-Meteo CSP entry.
- Preview screenshot intermittently returns black — start a **fresh** preview server; else verify via
  DOM (`preview_eval`). Fresh preview tabs can start at **0×0 or reset on reload** — `preview_resize`
  to explicit 1280×840 before measuring/screenshotting.
- After deploy, edge can serve a **stale** copy briefly — verify with a `?cb=$RANDOM` cache-buster.
- Images: `sips` + `cwebp`, no ImageMagick; review candidates via a Python/PIL contact sheet.
