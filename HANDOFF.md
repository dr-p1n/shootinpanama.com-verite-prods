# Handoff — Verite Producciones "Shoot In Panama" website

Marketing website for **Verite Producciones** ("Shoot In Panama"), a full-service **film-production
services company in Panama** for international productions (crew, permits, locations, logistics,
incentives). Owner's **first film-industry client** — bar is "exceptional." Client-facing demo/proposal.

## ★ Two proposals (identical site, different Home hero image)
- **Cinematic** → https://hero-cinematic.shootinpanama-verite.pages.dev — moody backlit
  cinematographer-with-camera silhouette (teal light).
- **Clapperboard** → https://hero-clapperboard.shootinpanama-verite.pages.dev — darkened
  clapperboard macro.
Branches are identical **except the Home hero image** (inner-page headers/OG are shared). Shared work
is committed on `hero-cinematic` then **cherry-picked** to `hero-clapperboard`.
⚠️ In-flight (below) this is changing: the **cinematic** branch is getting a distinct **editorial
theme**, so the two branches will start to differ by more than the hero.

## Infrastructure & workflow
- **Host:** Cloudflare Pages, project `shootinpanama-verite`, account `julioernestolv@gmail.com`
  (id `2b29809d1391e748856d98e409edaf0d`). `wrangler` authed.
- **Repo:** GitHub `dr-p1n/shootinpanama.com-verite-prods` (`gh` authed as `dr-p1n`).
- **Single file:** everything is `public/index.html` — static **SPA**, pages toggle via `showPage(id)`;
  `pages` array in JS must stay in sync with the mobile-link order. `public/_headers` CSP must keep
  `connect-src ... https://api.open-meteo.com` (live weather) — and will need the Google endpoint host
  added when the lead-capture Sheet is wired (see Pending).
- **Branches:** `main` auto-deploys to https://shootinpanama-verite.pages.dev but is **STALE** (old
  desert-clapperboard hero, none of the redesign). `hero-cinematic` / `hero-clapperboard` are the real
  A/B previews.
- **Deploy a preview:** `wrangler pages deploy public --project-name shootinpanama-verite --branch <b> --commit-dirty=true`
- **Domain:** `shootinpanama.com` NOT registered (client owns `veriteproducciones.net` on Bluehost).
  `scripts/set-domain.sh <domain>` rewrites canonical/OG/JSON-LD at cutover.
- **Contact:** Ricardo Barria · rbarria@veriteproducciones.net · +507 6612-7525.

## Current page structure (SPA tabs)
Home · Work · Services · **Government Incentives** (own tab) · Resources · Contact.

## What's been built
1. Repo + Pages + GitHub Actions auto-deploy; optimized responsive imagery (WebP+JPEG); security
   headers; SEO (OG, Twitter, canonical, JSON-LD Organization/ProfessionalService/WebSite, IQ `memberOf`,
   Organization `logo`).
2. Mobile hamburger nav; responsive grids; fixed overflow.
3. Full-bleed photographic hero (cinematic / clapperboard A/B).
4. Copy in the client's real article voice (source productionlinkint.com/countries/panama):
   "Hub of the Americas", "Carbon Negative" (Verite runs the country's only 100% solar studio).
5. **Real Verite imagery** — client delivered a 27-shot BTS catalog (`verite - bts caatlog/`, iPhone
   HEIC). 15 curated, converted + optimized to `assets/bts01..15` (thumb `-t` + full, WebP+JPEG).
6. **Work → "From The Set"** is a **3-column contact sheet** (15 uniform reduced tiles, 1.5rem gaps)
   with a **click-to-enlarge lightbox** (prev/next, ← → keys, click-advance, Esc/backdrop, "NN / 15",
   neighbour preload). Selected-work grid features **MrBeast** in the lead slot.
7. **Government Incentives for International Productions** is its **own tab** (Film Law 16 · 25% cash
   rebate · 0% duty · single-window · $150/wk · 4-step process · what-qualifies/fine-print/worked
   example). Services keeps a **teaser** with a CTA through to it.
8. **Resources** recast as gated **pre-production/educational guides** (producer's field guide, the
   25% rebate explained, location lookbook, 90-days-to-camera checklist, budgeting starter,
   carbon-negative briefing). "Download" opens a **lead-capture gate** (name/email/company). NOTE:
   currently a `mailto:` hand-off — see Pending for the Google Sheet.
9. **Discretion / NDA** value prop on Home. Live **Open-Meteo weather** + season copy on Services.
10. **Verite logo** (client's circular badge, `WhatsApp Image 2026-07-08…jpeg`, 864²): circle-masked
    to transparent PNG/WebP → nav (90px, 68 scrolled) + all footers (136px); favicons (16/32/48) +
    180px apple-touch; **1200×630 OG social card** (`assets/og-card.jpg`, logo on ink) drives
    og:image/twitter:image. Source was opaque JPEG — a transparent PNG/SVG from the client would sharpen
    small sizes.
11. Type: **Fraunces** (italic serif) + **DM Sans**. Palette `--ink #03060a` / `--paper #EEECEA` /
    `--accent #C9541E`, teal shadows.

## Client preferences (honor)
- Hero MUST be full-bleed, photorealistic, cinematic. REJECTED: CSS "slate" gimmick, plain skyline.
- Modern-luxury type, spatial alignment, real photography, restraint. Likes discretion/NDAs. Wants
  detailed rebate info (done). Reference competitor **nafta.tv** — out-detail on incentives.
- Logo must have presence / be readable (why it's now large).
- Never push experiments to `main` without client OK.

## In-flight this session (direction just given — may be partially done)
- **Landing (Home) copy, BOTH branches:** lead with the **offerings** (services), reduce the narrative
  "article" (Hub of the Americas / Carbon Negative) to a **small teaser**.
- **Cinematic branch theme → more editorial:** reduce reliance on **translucent/transparent text
  boxes** and **section divider hairlines** (`border-top:1px solid var(--rule)`); lean on typography +
  whitespace. This makes cinematic diverge from clapperboard beyond the hero — commit theme changes on
  `hero-cinematic` only; keep copy changes shared via cherry-pick.
- The CEO wants a **tab-by-tab visual comparison** of the two links (in lieu of a Loom). Preview
  `screenshot` tool is flaky (returns black) — a fresh server sometimes fixes it; otherwise a headless
  full-page capture of the two live URLs (hash routes: `#work` etc.) montaged is the fallback.

## Pending / next steps
- **Wire the Resources download gate to a Google Sheet** (client chose Sheets). Plan: Google Apps
  Script Web App (`doPost` → append row), form POSTs form-urlencoded `no-cors`; add
  `https://script.google.com https://script.googleusercontent.com` to `_headers` connect-src; keep
  mailto as fallback. Needs the client's Apps Script `/exec` URL.
- Finish shortening the **Resources card copy** (3 of 6 were trimmed).
- **Client picks a hero** → merge that branch to `main`.
- Real client-logo strip / full client list on Work; custom-domain decision.

## Gotchas
- Edit `public/index.html` only. Keep shared changes synced via cherry-pick; keep **cinematic-only**
  theme changes OFF clapperboard.
- Cherry-picks can conflict on the head **OG/hero image lines** (branches differ there) — resolve to
  the shared/new value.
- Live weather needs the Open-Meteo CSP entry.
- Preview screenshot intermittently returns black — start a **fresh** preview server; else verify via
  DOM (`preview_eval`). Fresh preview tabs can also start at **0×0** — `preview_resize` to explicit
  1280×840 before measuring/screenshotting.
- Images: `sips` (HEIC→JPEG, orientation baked) + `cwebp`; no ImageMagick. Review candidates via a
  Python/PIL contact sheet (one image-token instead of many).
