# Shoot In Panama — session handoff (v5)

Paste this as the opening CONTEXT for a fresh chat.

## Project / infra
- Live site: https://www.shootinginpanama.com (Cloudflare Pages project `shootinpanama-verite`, account julioernestolv@gmail.com, wrangler authed). GitHub: dr-p1n/shootinpanama.com-verite-prods.
- Repo (shell DEFAULT cwd — do NOT `cd` to other similar paths; stale copies exist):
  `/Users/jelv/Desktop/backup 23.2.2026/DATRUM/DATRUM projects/shoot in panama :: VERITE`
- Branch `hero-cinematic` (HEAD `43d5cea`, in sync with origin). Deploy: `npx wrangler pages deploy --branch main` (config from wrangler.toml, pages_build_output_dir="public"). Verify live with `?cb=$RANDOM`; www edge lags a deploy by ~1 min, the returned `*.pages.dev` deployment URL is authoritative.
- Single-page app: one `public/index.html` with `.page` sections (#page-home…#page-contact); `/es/` is the SAME html served via `_redirects` rewrite `/es/* -> /index.html`, translated client-side by `public/i18n.js` (walks body text nodes + swaps head tags). Asset paths are root-absolute (`/assets/…`) so they resolve under `/es/`.

## Lead capture (built earlier, all live)
- `functions/api/lead.js` — POST /api/lead: validates (email required), honeypot ("website"), saves to KV (binding LEADS), then Sheet append, then Resend email. Timestamps in America/Panama (UTC-5). Email = branded HTML (numbered fields + "Open the leads Google Sheet" button) with plain-text fallback; from LEAD_FROM, to LEAD_TO, reply_to = enquirer.
- `functions/api/leads.js` — GET /api/leads?token=… (KV read-back).
- Read leads: https://www.shootinginpanama.com/api/leads?token=ca227c8b4359c76216c36239690540a9
- wrangler.toml vars: LEAD_TO="rbarria@veriteproducciones.net", LEAD_FROM="Shoot In Panama <noreplymarketing@shootinginpanama.com>", SHEET_VIEW_URL=the sheet /edit#gid=1181426352. KV LEADS id 3d94515c1b3d4e70b7d983457fd33a47.

## Secrets / destinations status
- LEADS_TOKEN: SET (ca227c8b4359c76216c36239690540a9, rotatable).
- SHEET_ENDPOINT: SET + LIVE. Google Sheet (owner julioernestolv@gmail.com): https://docs.google.com/spreadsheets/d/10sjV8IIA6WPnuwGa-9gfrJdTdKAgtClQy7-4ICjALCA (data on the **Leads** tab, gid 1181426352). Apps Script Web App /exec id: AKfycbx5A8DipeErdkzLLBdgTPXT05LcXFgNuemFm7zRiivAf271L9VTVwDOuL6DNCiTR2iN. Every submission appends a row. **TODO: share the Sheet with rbarria@veriteproducciones.net** so the email button doesn't hit a request-access wall.
- RESEND_API_KEY: **NOT set** — email pending domain verification (see Alberto below). Resend account julioernestolv@gmail.com; domain shootinginpanama.com added, region us-east-1, status pending DNS.

## PENDING — Alberto (client IT, +507 6334-8380, via WhatsApp). Combined message in `docs/mensaje-alberto.md`.
DNS is at **Bluehost** (ns1/ns2.69-49-242-120.bluehost.com). apex A → 69.49.242.120 (Bluehost, serves OLD "VERITE.SERVICES" site). www CNAME → shootinpanama-verite.pages.dev (Cloudflare). No MX/email on the domain.
1. **Resend DNS** (add records, same zone as www, no nameserver change): TXT `resend._domainkey` = the DKIM key (in docs/resend-dns-for-alberto.md — must be exact); MX `send` = feedback-smtp.us-east-1.amazonses.com (pri 10); TXT `send` = v=spf1 include:amazonses.com ~all; optional TXT `_dmarc` = v=DMARC1; p=none;.
2. **Apex HTTPS redirect** (Bluehost hosting, .htaccess, NOT DNS): `https://shootinginpanama.com` (no-www) serves the old site over HTTPS instead of redirecting to www. Fix = add to .htaccess in the apex docroot:
   `RewriteEngine On` / `RewriteCond %{HTTP_HOST} ^shootinginpanama\.com$ [NC]` / `RewriteRule ^ https://www.shootinginpanama.com%{REQUEST_URI} [L,R=301]`
   (http already redirects; only https is broken.) Details in docs/apex-redirect-fix.md.
- **After DNS live:** verify domain in Resend → create API key → `npx wrangler pages secret put RESEND_API_KEY --project-name shootinpanama-verite` → redeploy → POST a test lead and confirm `emailed:true`.

## Done this session (all committed + deployed)
- Sheet backup wired + verified end-to-end.
- Email HTML template (numbered fields + Sheet link button), UTF-8 safe; sender → noreplymarketing@.
- Panama-local timestamps (was UTC).
- BTS gallery: removed 2 stills, added car (bts10) + crate as a last-row **portrait exception** (`.cs-cell--fit`, object-fit:contain).
- Locations: per-card **carousels** from `data-gallery="basename,…"` (dots + lightbox counter + swipe). Casco Viejo card = 7 photos (church + 6 from `casco lot.zip`). Fixed Casco orientation (webp had baked sideways; regenerated upright).
- Fixed **/es/ broken images** (relative `assets/` → absolute `/assets/`, 105 refs).
- Weather heading "Shoot year-round" → **"Shoot 365 days." + "(366 days in leap years)"** (EN+ES, `.wx-leap`).
- SEO: title 58 chars ("Panama Film Production Services & Fixers | Shoot In Panama"), description 150, OG/Twitter synced, **Spanish head tags** (i18n swaps title/desc for /es/), **single H1** (contact hero → h2), robots meta full directive, **X-Robots-Tag** header, and home now uses clean `/` (no `#home`) so Indexable/Canonical go green when testing the homepage URL (not `/#home`).

## Open / undecided
- **Body text size**: user said it "feels small, should be size 11"; base is 15px, body text renders ~12–14px (rem-based), so literal 11px would shrink it. Asked to clarify (11px vs ~11pt/bigger); user **dismissed** — awaiting decision, nothing changed.
- Optional: remove inert `keywords` meta (line 7, Google ignores it — left client's content).
- Optional/large: true per-section indexable URLs would need path routing + prerender (not the hash SPA). Not done.
- Sheet test rows to delete (all QA): Endpoint Test, Sheet Wiring Test, Timezone Test, TZ Confirm, "LOOK-FOR-THIS-ROW" MARKER, jlv, plus any personal tests.

## Assistant constraints
Cannot create accounts (Resend signup) or edit registrar/Bluehost DNS/hosting (Alberto's). CAN: all Cloudflare CLI (secrets, deploy); drive Resend/Sheet dashboards in the connected browser after the user signs in; generate/convert images (sips/cwebp/PIL). KV already captures every submission, so leads are never lost while email/redirect are pending.
