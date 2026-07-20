# Fix: apex (no-www) should redirect to the cinematic site

## Problem
- `www.shootinginpanama.com` → Cloudflare Pages (new cinematic site). ✅
- `shootinginpanama.com` (apex) → A record `69.49.242.120` = Bluehost Apache, serving the OLD "VERITE.SERVICES" site.
- Over **HTTP** the apex 301-redirects to www (works), but over **HTTPS** Bluehost serves the old site (200) and never redirects. Browsers default to HTTPS, so no-www visitors land on the wrong site.

## Decision
Keep DNS at Bluehost (no nameserver change). Fix the redirect on the Bluehost hosting side.
(No MX/email exists on the domain, but we're leaving the zone as-is per decision.)

## Fix — Bluehost `.htaccess`
Edit `.htaccess` in the apex document root (the folder Bluehost serves `shootinginpanama.com` from — usually `public_html` or the domain's folder). Add at the top:

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^shootinginpanama\.com$ [NC]
RewriteRule ^ https://www.shootinginpanama.com%{REQUEST_URI} [L,R=301]
```

If the file already has `RewriteEngine On`, don't repeat it — just add the two `RewriteCond`/`RewriteRule` lines right after it.

This 301-redirects any no-www request (http and https) to the www site, keeping the path. It touches nothing on `www` and nothing in DNS.

## Mensaje para Alberto (WhatsApp, español)

> Alberto, hay que arreglar la redirección del dominio sin www. Ahora mismo https://shootinginpanama.com muestra el sitio viejo (VERITE.SERVICES) en Bluehost; debe redirigir a https://www.shootinginpanama.com, que es el sitio nuevo. La versión http ya redirige bien; el problema es solo en https.
>
> En el hosting de Bluehost, edita el archivo .htaccess en la raíz del dominio (public_html o la carpeta del dominio) y agrega estas líneas al inicio:
>
> RewriteEngine On
> RewriteCond %{HTTP_HOST} ^shootinginpanama\.com$ [NC]
> RewriteRule ^ https://www.shootinginpanama.com%{REQUEST_URI} [L,R=301]
>
> Si el archivo ya tiene "RewriteEngine On", no lo repitas, solo agrega las dos líneas de abajo. Esto redirige cualquier visita sin www (http y https) al sitio con www, conservando la ruta. No afecta el www ni el DNS. Cuando lo tengas puesto, me avisas y lo verifico.

## Verify (after Alberto applies it)
`curl -sSI https://shootinginpanama.com` should return `301` with `Location: https://www.shootinginpanama.com/`.
