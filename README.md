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
wrangler pages deploy . --project-name shootinpanama-verite
```
