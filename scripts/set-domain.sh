#!/usr/bin/env bash
#
# Repoint the site's SEO/OG/JSON-LD URLs from the current host to a new one.
# Idempotent: it reads the current host from the <link rel="canonical"> tag,
# so it works no matter how many times you've cut over before.
#
# Usage:
#   ./scripts/set-domain.sh shootinpanama.com
#   ./scripts/set-domain.sh https://shoot.veriteproducciones.net/
#
set -euo pipefail

RAW="${1:?Usage: set-domain.sh <domain e.g. shootinpanama.com>}"
# Normalise: strip scheme and trailing slash -> bare host
NEW_HOST="${RAW#http://}"; NEW_HOST="${NEW_HOST#https://}"; NEW_HOST="${NEW_HOST%%/*}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FILE="$ROOT/public/index.html"

# Current host = whatever the canonical tag points at right now.
OLD_HOST="$(grep -oE 'rel="canonical" href="https?://[^/"]+' "$FILE" | grep -oE 'https?://[^/"]+' | sed -E 's#https?://##')"
if [ -z "$OLD_HOST" ]; then
  echo "!! Could not find current host in canonical tag. Aborting." >&2
  exit 1
fi
if [ "$OLD_HOST" = "$NEW_HOST" ]; then
  echo "Already pointed at $NEW_HOST — nothing to do."
  exit 0
fi

# BSD sed (macOS) needs the '' arg; this repo is developed on macOS.
sed -i '' "s|$OLD_HOST|$NEW_HOST|g" "$FILE"
COUNT="$(grep -c "$NEW_HOST" "$FILE" || true)"

cat <<EOF
Rewrote $COUNT URL(s): $OLD_HOST  ->  $NEW_HOST   (public/index.html)

Remaining cutover steps:
  1. Connect the domain to the Pages project (one time):
       Cloudflare dashboard -> Workers & Pages -> shootinpanama-verite
         -> Custom domains -> "Set up a domain" -> $NEW_HOST
       (Cloudflare adds the DNS/CNAME + provisions TLS automatically once
        the domain's nameservers are on Cloudflare.)
  2. Ship the URL change:
       git commit -am "Point site at $NEW_HOST" && git push
     (GitHub Actions auto-deploys to Cloudflare Pages.)
  3. Verify:
       curl -sI https://$NEW_HOST/ | grep -i '^HTTP'
       curl -s  https://$NEW_HOST/ | grep -oE '<link rel="canonical"[^>]*>'
EOF
