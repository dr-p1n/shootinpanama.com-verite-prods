# Shoot In Panama · Verite Producciones

A single-file static landing page demo for **Verite Producciones** — a full-service production
partner for international film, advertising, and documentary projects in Panama.

Self-contained `index.html`: inline CSS/JS, Google Fonts, and a client-side `mailto:` contact form
(no backend).

## Live demo

https://shootinpanama-verite.pages.dev

## Deployment

Hosted on Cloudflare Pages. Every push to `main` redeploys automatically via GitHub Actions
(`.github/workflows/deploy.yml`, which runs `wrangler pages deploy`).

Manual deploy:

```bash
wrangler pages deploy public --project-name shootinpanama-verite
```

## Custom domain cutover

The demo lives on `shootinpanama-verite.pages.dev`. When a real domain is chosen, repoint every
canonical / Open Graph / JSON-LD URL in one step, then connect the domain in Cloudflare:

```bash
./scripts/set-domain.sh shootinpanama.com   # rewrites all URLs in public/index.html (idempotent)
git commit -am "Point site at shootinpanama.com" && git push   # auto-deploys
```

The script prints the remaining one-time step (Cloudflare → Pages → Custom domains). Until then,
the `pages.dev` URLs are correct and link previews work — do **not** switch to a domain that isn't
live yet, or shared-link preview images will break.
