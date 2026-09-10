// Serves every entry in routes.js as a real page.
//
// public/index.html is authored as one document containing every section. For a
// request to /services (or /es/services) this fetches that document and, with
// HTMLRewriter, keeps only the services section and swaps in that route's own
// <title>, description, canonical, hreflang, social card and JSON-LD. The result
// is one URL per subject with content specific to it, from a single source file.
//
// Anything not in the route table (/api/*, /assets/*, /styles.css …) passes
// straight through untouched.

import { ROUTES, SITE, matchRoute, urlFor } from './routes.js';

const ORG = SITE + '/#organization';
const WEBSITE = SITE + '/#website';

// Productions listed on /work — emitted as structured data so an answer can cite
// the page for a specific credit rather than for the site in general.
const PRODUCTIONS = [
  { name: 'MrBeast productions in Panama', type: 'CreativeWorkSeries', note: 'Digital · International creator — four productions' },
  { name: "The Amazing Race", type: 'TVSeries', note: 'CBS — USA (x3), Canada, Australia and Finland editions' },
  { name: "Today Show — Where in the World is Matt Lauer?", type: 'TVSeries', note: 'NBC — broadcast' },
  { name: 'The Challenge', type: 'TVSeries', note: 'MTV — three seasons based in Panama' },
  { name: 'ARP', type: 'TVSeries', note: 'Netflix — series' },
  { name: 'Survive the Raft', type: 'TVSeries', note: 'Discovery — reality television' },
  { name: 'OAS 56th General Assembly, Panama 2026', type: 'Event', note: 'Organization of American States — institutional' },
  { name: 'A Land Divided, A World United', type: 'Movie', note: 'IMAX feature on the Panama Canal' }
];

function jsonLd(route, lang) {
  const meta = route[lang];
  const url = urlFor(route.slug, lang);
  const image = SITE + route.image;
  const inLanguage = lang === 'es' ? 'es' : 'en';
  const isEssay = route.type === 'Article';

  const crumbs = [{ name: lang === 'es' ? 'Inicio' : 'Home', item: urlFor('', lang) }];
  if (isEssay) crumbs.push({ name: lang === 'es' ? 'Recursos' : 'Resources', item: urlFor('resources', lang) });
  if (route.slug) crumbs.push({ name: meta.name, item: url });

  const graph = [
    {
      '@type': isEssay ? 'WebPage' : (route.type || 'WebPage'),
      '@id': url + '#webpage',
      url,
      name: meta.title,
      description: meta.desc,
      inLanguage,
      isPartOf: { '@id': WEBSITE },
      about: { '@id': ORG },
      primaryImageOfPage: image,
      breadcrumb: { '@id': url + '#breadcrumb' }
    },
    {
      '@type': 'BreadcrumbList',
      '@id': url + '#breadcrumb',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem', position: i + 1, name: c.name, item: c.item
      }))
    }
  ];

  if (isEssay) {
    graph.push({
      '@type': 'Article',
      '@id': url + '#article',
      headline: meta.name,
      description: meta.desc,
      articleSection: route.section,
      image,
      inLanguage,
      mainEntityOfPage: { '@id': url + '#webpage' },
      author: { '@id': ORG },
      publisher: { '@id': ORG },
      isPartOf: { '@id': url + '#webpage' }
    });
  }

  if (route.slug === 'work') {
    graph.push({
      '@type': 'ItemList',
      '@id': url + '#productions',
      name: lang === 'es' ? 'Producciones atendidas en Panamá' : 'Productions serviced in Panama',
      itemListElement: PRODUCTIONS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': p.type, name: p.name, description: p.note, locationCreated: { '@type': 'Country', name: 'Panama' } }
      }))
    });
  }

  if (route.slug === 'incentives' || route.slug === 'resources/panama-25-percent-cash-rebate') {
    graph.push({
      '@type': 'Service',
      '@id': url + '#rebate-service',
      name: lang === 'es'
        ? 'Estructuración y presentación del rebate del 25% de la Ley de Cine 16 de Panamá'
        : 'Panama Film Law 16 — 25% cash rebate structuring and filing',
      serviceType: lang === 'es' ? 'Incentivo fiscal para producción audiovisual' : 'Film production tax incentive',
      provider: { '@id': ORG },
      areaServed: { '@type': 'Country', name: 'Panama' },
      description: lang === 'es'
        ? 'Panamá devuelve en efectivo el 25% del gasto elegible en el país bajo la Ley de Cine 16 (2012). Gasto mínimo elegible de $500,000 USD, tope de $25M por proyecto, auditoría de cumplimiento certificada por un CPA obligatoria, y desembolso de hasta 36 meses tras cerrar la auditoría.'
        : 'Panama returns 25% of qualifying in-country spend as cash under Film Law 16 (2012). Minimum qualifying spend $500,000 USD, $25M cap per project, a certified (CPA) compliance audit is mandatory, and disbursement can take up to 36 months after the audit closes.'
    });
  }

  if (route.slug === 'services') {
    graph.push({ '@type': 'ProfessionalService', '@id': SITE + '/#service', url });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

class Attr {
  constructor(name, value) { this.name = name; this.value = value; }
  element(el) { el.setAttribute(this.name, this.value); }
}
class Text {
  constructor(value) { this.value = value; }
  element(el) { el.setInnerContent(this.value); }
}
class Remove {
  element(el) { el.remove(); }
}

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Static assets and API routes: never touched.
  if (url.pathname.startsWith('/api/') || url.pathname.includes('.')) return next();

  const match = matchRoute(url.pathname);
  if (!match) return next();

  const { route, lang } = match;
  const meta = route[lang];
  const canonical = urlFor(route.slug, lang);
  const altEn = urlFor(route.slug, 'en');
  const altEs = urlFor(route.slug, 'es');
  const image = SITE + route.image;

  let res;
  try {
    // Ask the asset server for "/", not "/index.html" — the latter answers with a
    // 308 to the canonical path instead of the document.
    res = await next(new Request(new URL('/', url), request));
  } catch (err) {
    return next();
  }
  if (!res.ok) return res;

  let rw = new HTMLRewriter()
    .on('html', new Attr('lang', lang))
    .on('title', new Text(meta.title))
    .on('meta[name="description"]', new Attr('content', meta.desc))
    .on('meta[property="og:title"]', new Attr('content', meta.title))
    .on('meta[property="og:description"]', new Attr('content', meta.desc))
    .on('meta[property="og:url"]', new Attr('content', canonical))
    .on('meta[property="og:image"]', new Attr('content', image))
    .on('meta[property="og:locale"]', new Attr('content', lang === 'es' ? 'es_PA' : 'en_US'))
    .on('meta[property="og:type"]', new Attr('content', route.type === 'Article' ? 'article' : 'website'))
    .on('meta[name="twitter:title"]', new Attr('content', meta.title))
    .on('meta[name="twitter:description"]', new Attr('content', meta.desc))
    .on('meta[name="twitter:image"]', new Attr('content', image))
    .on('link[rel="canonical"]', new Attr('href', canonical))
    .on('link[hreflang="en"]', new Attr('href', altEn))
    .on('link[hreflang="es"]', new Attr('href', altEs))
    .on('link[hreflang="x-default"]', new Attr('href', altEn))
    .on('#' + route.node, new Attr('class', route.type === 'Article' ? 'essay active' : 'page active'))
    .on('#nav-' + route.nav, new Attr('class', route.nav === 'contact' ? 'nav-cta active' : 'nav-link active'))
    .on('#mnav-' + route.nav, new Attr('class', route.nav === 'contact' ? 'mobile-link mm-cta active' : 'mobile-link active'))
    .on('head', {
      element(el) {
        el.append('\n<script type="application/ld+json">' + jsonLd(route, lang) + '</script>\n', { html: true });
        // i18n.js reads this instead of guessing at head metadata client-side.
        // A JSON data block, not an inline script — the CSP allows no inline JS.
        el.append(
          '<script type="application/json" id="route-meta">' + JSON.stringify({
            slug: route.slug, lang,
            en: { title: route.en.title, desc: route.en.desc, url: altEn },
            es: { title: route.es.title, desc: route.es.desc, url: altEs }
          }).replace(/</g, '\\u003c') + '</script>\n',
          { html: true }
        );
      }
    });

  // Drop every section that does not belong to this URL (one selector per call —
  // HTMLRewriter takes a single selector, not a comma-separated list).
  for (const r of ROUTES) {
    if (r.node !== route.node) rw = rw.on('#' + r.node, new Remove());
  }

  const out = rw.transform(res);
  const headers = new Headers(out.headers);
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  return new Response(out.body, { status: 200, headers });
}
