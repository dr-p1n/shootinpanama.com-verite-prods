# Handoff — Verite Producciones "Shoot In Panama" website

You are continuing work on a marketing website for **Verite Producciones** ("Shoot In Panama"),
a full-service **film-production company in Panama** that services international productions
(crew, permits, locations, logistics, incentives). This is the owner's **first film-industry
client**, so the bar is "exceptional." The site is a client-facing demo/proposal.

## ★ The two proposals to show the client (identical site, different hero image)
- **Cinematic** → https://hero-cinematic.shootinpanama-verite.pages.dev
  Full-bleed hero: a moody, backlit **cinematographer silhouette holding a cinema camera** (teal
  studio light). Reads "film" instantly; palette matches the site.
- **Clapperboard** → https://hero-clapperboard.shootinpanama-verite.pages.dev
  Full-bleed hero: a **film clapperboard macro shot**, darkened/graded.
Both branches are byte-identical except the hero image; all other work below is on both.
(Hero images are high-quality **Unsplash placeholders** — to be replaced by the client's real
Verite catalog stills.)

## Infrastructure & workflow
- **Host:** Cloudflare Pages, project `shootinpanama-verite` (account id via `wrangler whoami`).
  `wrangler` is authed on the dev machine.
- **Repo:** GitHub `dr-p1n/shootinpanama.com-verite-prods` (`gh` authed).
- **Single file:** everything is `public/index.html` (a small static **SPA** — pages toggle via a
  `showPage(id)` JS function; nav is a hamburger on mobile). `public/_headers` holds the CSP —
  it MUST keep `connect-src ... https://api.open-meteo.com` or the live weather breaks.
- **Branches:**
  - `main` = auto-deploys to https://shootinpanama-verite.pages.dev via GitHub Actions on push.
    ⚠️ **`main` is STALE** — it still has the OLD desert-clapperboard hero and NONE of the
    redesign/new content. Do not treat it as current.
  - `hero-cinematic` and `hero-clapperboard` = the real, current A/B proposals (deploy as Cloudflare
    Pages preview branches). Shared content is committed to `hero-cinematic` then **cherry-picked**
    to `hero-clapperboard` to keep them in sync.
- **Deploy a branch preview:** `wrangler pages deploy public --project-name shootinpanama-verite
  --branch <branch> --commit-dirty=true`
- **Custom domain:** `shootinpanama.com` is **NOT registered** (client owns `veriteproducciones.net`
  on Bluehost). Kept on `pages.dev`. `scripts/set-domain.sh <domain>` rewrites all
  canonical/OG/JSON-LD URLs in one pass at cutover.

## What's been built (chronological log)
1. Repo + Cloudflare Pages + GitHub Actions auto-deploy; served from `public/`.
2. Self-hosted + optimized all imagery (responsive WebP+JPEG); security headers (CSP/HSTS/etc.),
   long-cache for assets; **SEO**: Open Graph + Twitter cards, canonical, and **JSON-LD**
   (Organization / ProfessionalService / WebSite, incl. IQ `memberOf`).
3. **Mobile-ready:** hamburger nav overlay; fixed horizontal overflow; responsive grids.
4. Custom-domain **cutover script** + docs.
5. **Hero redesign** (several iterations; see "Client preferences"): landed on a **full-bleed
   photographic hero** — two options (cinematic silhouette / clapperboard).
6. **Content rewritten in the client's real article voice** (source:
   productionlinkint.com/countries/panama): Home now has narrative sections —
   **"Hub of the Americas"** ("A man, a plan, a canal…", 90+ direct flights, doubling for
   Bolivia/Haiti/Corto Maltese) and **"Carbon Negative"** (one of 3 carbon-negative nations;
   **Verite runs the country's only 100% solar studio**).
7. **Services page:** detailed **Incentives** section (Film Law 16 · 25% cash rebate · 0% import
   duty · single-window permits · $150/wk Film Commission fee · 4-step filing process);
   **Locations** grid (6 image tiles: Caribbean beaches, Panama City, rainforest, ports/canal,
   Casco Viejo, airports); **live Weather** for 4 regions via the keyless **Open-Meteo** API +
   dry/green-season copy.
8. **Discretion / NDA** value proposition on Home ("Some productions can't afford a leak.") —
   NDAs, closed sets, secure logistics, Panama's built-in privacy. A differentiator vs the client's
   reference competitor **nafta.tv**.
9. **Full-bleed image headers** added to Work, Services, Resources pages.
10. **IQ footer badge** made a certification **backlink** to internationalquorum.com (all pages).
11. **Modern-luxury typography:** switched serif from Playfair → **Fraunces** (optical, high-contrast)
    paired with **DM Sans**; consistent 3rem/1.5rem section insets for spatial alignment.

## Current page structure (`public/index.html`, SPA)
- **Home:** full-bleed hero → 3 quick services → "Hub of the Americas" → "Carbon Negative" →
  "Discretion (NDA)" → footer.
- **Work:** full-bleed header → selected-work grid → footer.
- **Services:** full-bleed header → 3 disciplines → stats band → **Incentives** → **Locations** →
  **Weather** → footer.
- **Resources:** full-bleed header → downloadable-docs grid (mailto request flow) → footer.
- **Contact:** header → contact info + RFQ form (client-side `mailto:` to the Verite contact).

## Design language
- Palette: `--ink #03060a`, `--paper #EEECEA`, `--accent #C9541E` (burnt orange), teal shadows.
- Type: **Fraunces** (italic serif accents/leads) + **DM Sans** (body/UI). Luxury, editorial, dark.
- Client cares about: **spatial alignment**, **modern luxury** feel, real photography, restraint.

## Client preferences / feedback (accumulated — honor these)
- Hero MUST be **full-bleed, photorealistic, cinematic** ("invoke film inspiration"). REJECTED: a
  rendered CSS clapperboard "slate" (called it "silly/a gimmick") and a plain Panama City skyline
  (reads "Panama," not "film"). Prefer real film-production imagery, moody/dark.
- Wants **modern luxury font pairings** and **spatial alignment**.
- Likes **discretion/NDAs** as a value prop.
- Wants **detailed tax-rebate** info (done).
- Reference competitor **nafta.tv** — out-detail them on incentives, out-class them on type.
- Never push experiments to `main` (the live demo) without the client's OK.

## Pending / next steps
- **Client's real Verite stills** (incl. **jungle mobile shots** they have) → replace the Unsplash
  placeholders in the hero + location tiles. This is the single biggest upgrade left.
- **The actual Verite logo** → nav + footer (currently plain text "Shoot In Panama").
- **Client picks a hero** (cinematic vs clapperboard) → merge that branch to `main` so the live
  demo shows the redesign.
- Custom-domain decision.
- Optional polish: real client-logo strip, real client list (Bunim-Murray, Discovery, FOX, E!,
  The Today Show) on Work, local "fun facts" (¿Qué Xopa?, Ron Abuelo, patacones).

## Working notes / gotchas
- Edit `public/index.html` only; keep both branches synced via cherry-pick.
- Live weather needs the Open-Meteo entry in `_headers` CSP.
- The preview **screenshot** tool intermittently returns black — starting a **fresh** preview
  server fixes it; otherwise verify via DOM (`preview_eval`).
- Images are optimized with `sips` + `cwebp` (both installed); no ImageMagick (use a Python/PIL
  contact sheet to review candidates).
