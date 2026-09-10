// Route table — the single source of truth for the site's real URLs.
//
// The site is authored as one document (public/index.html) holding every section.
// functions/_middleware.js serves each entry below as its own URL: it keeps that
// entry's section, drops all the others, and swaps in the entry's own title,
// description, canonical, social card and structured data. Spanish mirrors live
// under /es/<slug> and share the slug so the hreflang pairs stay one-to-one.
//
// `node` is the id of the <div class="page"> or <article class="essay"> to keep.
// `nav` is which nav item lights up (essays sit under Resources).

export const SITE = 'https://www.shootinginpanama.com';

export const ROUTES = [
  {
    slug: '',
    node: 'page-home',
    nav: 'home',
    image: '/assets/og-card.jpg',
    en: {
      title: 'Panama Film Production Services & Fixers | Shoot In Panama',
      desc: 'Full-service production partner for international film, advertising and documentary shoots in Panama — fixers, crew, permits, locations and equipment.',
      name: 'Home'
    },
    es: {
      title: 'Servicios de Producción de Cine en Panamá | Shoot In Panama',
      desc: 'Socio de producción integral para cine, publicidad y documental internacional en Panamá — fixers, crew, permisos, locaciones y equipo.',
      name: 'Inicio'
    }
  },
  {
    slug: 'work',
    node: 'page-work',
    nav: 'work',
    image: '/assets/ph-work-1920.jpg',
    en: {
      title: "Selected Work — Productions Shot in Panama | Shoot In Panama",
      desc: "CBS's The Amazing Race, Discovery's Survive the Raft, MTV's The Challenge, Netflix, NBC's Today Show and four MrBeast productions — each handled end-to-end from the ground in Panama.",
      name: 'Work'
    },
    es: {
      title: 'Trabajos — Producciones rodadas en Panamá | Shoot In Panama',
      desc: 'The Amazing Race de CBS, Survive the Raft de Discovery, The Challenge de MTV, Netflix, el Today Show de NBC y cuatro producciones de MrBeast — cada una ejecutada de principio a fin desde Panamá.',
      name: 'Trabajos'
    }
  },
  {
    slug: 'services',
    node: 'page-services',
    nav: 'services',
    image: '/assets/ph-services-1920.jpg',
    en: {
      title: 'Production Services, Fixers & Locations in Panama | Shoot In Panama',
      desc: 'Crew, permits, customs and location management for international productions in Panama — with location galleries coast to coast and a shooting calendar that runs all year.',
      name: 'Services'
    },
    es: {
      title: 'Servicios de Producción, Fixers y Locaciones en Panamá | Shoot In Panama',
      desc: 'Crew, permisos, aduanas y gestión de locaciones para producciones internacionales en Panamá — con galerías de locaciones de costa a costa y calendario de rodaje todo el año.',
      name: 'Servicios'
    }
  },
  {
    slug: 'incentives',
    node: 'page-incentives',
    nav: 'incentives',
    image: '/assets/ph-incentives-1920.jpg',
    en: {
      title: 'Panama Film Tax Incentives — 25% Cash Rebate (Film Law 16) | Shoot In Panama',
      desc: 'Panama returns 25% of qualifying in-country spend as cash. $500,000 minimum spend, $25M cap, mandatory CPA audit — structured and filed by a licensed local partner.',
      name: 'Incentives'
    },
    es: {
      title: 'Incentivos Fiscales de Cine en Panamá — Rebate del 25% (Ley 16) | Shoot In Panama',
      desc: 'Panamá devuelve en efectivo el 25% del gasto elegible en el país. Gasto mínimo de $500,000, tope de $25M, auditoría CPA obligatoria — estructurado y presentado por un socio local licenciado.',
      name: 'Incentivos'
    }
  },
  {
    slug: 'resources',
    node: 'page-resources',
    nav: 'resources',
    image: '/assets/ph-resources-1920.jpg',
    en: {
      title: 'Resources — Field Notes on Producing in Panama | Shoot In Panama',
      desc: "Field notes from the team that files the paperwork: the 25% cash rebate, the international producer's guide, tropical weather forecasting, and Panama on screen.",
      name: 'Resources'
    },
    es: {
      title: 'Recursos — Notas de campo sobre producir en Panamá | Shoot In Panama',
      desc: 'Notas de campo del equipo que presenta el papeleo: el rebate del 25%, la guía del productor internacional, el pronóstico del clima tropical y Panamá en pantalla.',
      name: 'Recursos'
    }
  },
  {
    slug: 'contact',
    node: 'page-contact',
    nav: 'contact',
    image: '/assets/ph-contact-1920.jpg',
    type: 'ContactPage',
    en: {
      title: 'Contact — Request a Quote for a Shoot in Panama | Shoot In Panama',
      desc: "Tell us the format, crew size and dates and we'll come back with a plan, a budget and a permit timeline. Ricardo Barria — Verite Producciones, Panama City.",
      name: 'Contact'
    },
    es: {
      title: 'Contacto — Solicita una cotización para rodar en Panamá | Shoot In Panama',
      desc: 'Cuéntanos el formato, el tamaño del crew y las fechas y volvemos con un plan, un presupuesto y un cronograma de permisos. Ricardo Barria — Verite Producciones, Ciudad de Panamá.',
      name: 'Contacto'
    }
  },

  // ── Essays (sub-pages under Resources) ──
  {
    slug: 'resources/panama-25-percent-cash-rebate',
    node: 'essay-rebate',
    nav: 'resources',
    image: '/assets/ph-incentives-1920.jpg',
    type: 'Article',
    section: 'Legal & Incentives',
    en: {
      title: 'The 25% Cash Rebate, Explained — Panama Film Law 16 | Shoot In Panama',
      desc: 'Film Law 16 in plain English: who qualifies, what spend counts, how the money comes back, and what Verite files so it reaches your budget.',
      name: 'The 25% Cash Rebate, Explained'
    },
    es: {
      title: 'El Rebate del 25%, explicado — Ley de Cine 16 de Panamá | Shoot In Panama',
      desc: 'La Ley 16 en lenguaje claro: quién califica, qué gasto cuenta, cómo regresa el dinero y qué presenta Verite para que llegue a tu presupuesto.',
      name: 'El Rebate del 25%, explicado'
    }
  },
  {
    slug: 'resources/international-producers-guide-to-panama',
    node: 'essay-guide',
    nav: 'resources',
    image: '/assets/ph-services-1920.jpg',
    type: 'Article',
    section: 'Field Guide',
    en: {
      title: "The International Producer's Guide to Panama | Shoot In Panama",
      desc: 'Geography, weather and the shooting calendar, locations coast to coast, and the crew depth behind 30 years of international productions.',
      name: "The International Producer's Guide to Panama"
    },
    es: {
      title: 'La guía del productor internacional sobre Panamá | Shoot In Panama',
      desc: 'Geografía, clima y calendario de rodaje, locaciones de costa a costa, y la profundidad de crew detrás de 30 años de producciones internacionales.',
      name: 'La guía del productor internacional sobre Panamá'
    }
  },
  {
    slug: 'resources/tropical-weather-forecasting-panama',
    node: 'essay-weather',
    nav: 'resources',
    image: '/assets/ph-work-1920.jpg',
    type: 'Article',
    section: 'Weather & Logistics',
    en: {
      title: 'Tropical Weather Forecasting: The Panama Field Guide | Shoot In Panama',
      desc: 'Hurricane-safe latitude, two-ocean microclimates and 18-foot Pacific tides — and why the smart 1st AD schedules hero shots for the hour right after the downpour.',
      name: 'Tropical Weather Forecasting: The Panama Field Guide'
    },
    es: {
      title: 'Pronóstico del clima tropical: la guía de campo de Panamá | Shoot In Panama',
      desc: 'Latitud a salvo de huracanes, microclimas de dos océanos y mareas del Pacífico de 18 pies — y por qué el 1er AD astuto agenda los planos clave para la hora justo después del aguacero.',
      name: 'Pronóstico del clima tropical: la guía de campo de Panamá'
    }
  },
  {
    slug: 'resources/a-man-a-plan-a-canal-panama',
    node: 'essay-overview',
    nav: 'resources',
    image: '/assets/ph-incentives-1920.jpg',
    type: 'Article',
    section: 'About Verite',
    en: {
      title: 'A Man, a Plan, a Canal: Panama — Verite Producciones | Shoot In Panama',
      desc: "The Hub of the Americas, where Panama has stood in on screen, the rebate's fine print, and the client list behind 30+ years in production.",
      name: 'A Man, a Plan, a Canal: Panama.'
    },
    es: {
      title: 'A man, a plan, a canal: Panama — Verite Producciones | Shoot In Panama',
      desc: 'El Hub de las Américas, dónde ha doblado Panamá en pantalla, la letra pequeña del rebate y la lista de clientes detrás de más de 30 años de producción.',
      name: 'A man, a plan, a canal: Panama.'
    }
  }
];

export const BY_SLUG = ROUTES.reduce((m, r) => (m[r.slug] = r, m), {});

// "/es/services" -> { route, lang }.  Returns null for anything not in the table.
export function matchRoute(pathname) {
  let p = pathname.replace(/\/+$/, '').replace(/^\/+/, '');
  let lang = 'en';
  if (p === 'es' || p.startsWith('es/')) {
    lang = 'es';
    p = p.slice(2).replace(/^\/+/, '');
  }
  const route = BY_SLUG[p];
  return route ? { route, lang } : null;
}

export const urlFor = (slug, lang) =>
  SITE + (lang === 'es' ? '/es' : '') + (slug ? '/' + slug : '/');
