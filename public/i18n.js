/* ── Bilingual (EN default / ES) ────────────────────────────────────────────
   Text-node engine: keeps English in the DOM as the source, swaps to Spanish
   from the dictionary below. Anything without a translation stays English
   (graceful fallback), so copy changes never break the site.
   Elements tagged data-i18n="slug" are translated whole (innerHTML) via "@slug"
   keys and their descendants are skipped, to avoid word-collisions. */
(function () {
  "use strict";

  var ES = {
    // ── Nav ──
    "Home": "Inicio",
    "Work": "Proyectos",
    "Services": "Servicios",
    "Incentives": "Incentivos",
    "Resources": "Recursos",
    "Get in Touch": "Contáctanos",

    // ── Home · hero ──
    "Verite Producciones · Panama City": "Verite Producciones · Ciudad de Panamá",
    "Panama. Where your next": "Panamá. Donde vive tu",
    "production lives.": "próxima producción.",
    "For over 30 years we've been the ground team international productions trust in Panama — handling crew, permits, compliance and logistics so your team arrives ready to shoot, not ready to problem-solve.": "Desde hace más de 30 años somos el equipo en tierra en el que confían las producciones internacionales en Panamá — gestionamos crew, permisos, cumplimiento y logística para que tu equipo llegue listo para rodar, no para resolver problemas.",
    "Request a Quote": "Solicitar cotización",
    "View Work": "Ver proyectos",

    // ── Home · offerings ──
    "What We Do": "Qué hacemos",
    "One team,": "Un solo equipo,",
    "scout to wrap.": "del scouting al wrap.",
    "We're the executive arm of your production in Panama. The same crew that scouts your location clears your permits, files your rebate and wraps your shoot — so your creative and production team stay focused on the work, not the paperwork.": "Somos el brazo ejecutivo de tu producción en Panamá. El mismo equipo que hace el scouting de tus locaciones tramita tus permisos, presenta tu rebate y cierra tu rodaje — para que tu equipo creativo y de producción se concentre en el trabajo, no en el papeleo.",
    "Production Services": "Servicios de producción",
    "Full crew, equipment and location management, from first scout to final wrap.": "Gestión integral de crew, equipo y locaciones, desde el primer scouting hasta el wrap final.",
    "Fixer & Logistics": "Fixer y logística",
    "Permits, talent coordination, transport and on-ground support across the country.": "Permisos, coordinación de talento, transporte y soporte en tierra en todo el país.",
    "Executive Compliance": "Cumplimiento ejecutivo",
    "Legal setup, insurance, customs and regulatory clearance for foreign productions.": "Estructura legal, seguros, aduanas y trámites regulatorios para producciones extranjeras.",
    "Government Incentives": "Incentivos del Estado",
    "A 25% cash rebate on qualifying spend, 0% import duty — structured and filed for you.": "Un rebate en efectivo del 25% sobre el gasto elegible, 0% de arancel de importación — estructurado y presentado por nosotros.",

    // ── Home · teaser ──
    "Over 30 years making Panama work on camera.": "Más de 30 años haciendo que Panamá funcione frente a cámara.",
    "Verite Producciones is the ground team behind international features, series and campaigns shooting in Panama — from": "Verite Producciones es el equipo en tierra detrás de largometrajes, series y campañas internacionales que ruedan en Panamá — desde",
    "and": "y",
    "to MrBeast. More than 30 years of crews, permits, locations and logistics, so your production arrives ready to shoot.": "hasta MrBeast. Más de 30 años de crews, permisos, locaciones y logística, para que tu producción llegue lista para rodar.",
    "Why Panama? One small country that": "¿Por qué Panamá? Un país pequeño que",
    "doubles for a dozen on screen": "dobla como una docena en pantalla",
    ", a": ", un",
    "25% cash rebate": "rebate en efectivo del 25%",
    "on qualifying spend, and the crew depth to keep a shoot on schedule — the Hub of the Americas, carbon-negative, discreet by design.": "sobre el gasto elegible, y la profundidad de crew para mantener el rodaje en agenda — el Hub de las Américas, carbono-negativo, discreto por diseño.",
    "See our work →": "Ver nuestro trabajo →",

    // ── Footer ──
    "Panama City · República de Panamá": "Ciudad de Panamá · República de Panamá",

    // ── Work ──
    "Selected Work": "Trabajo seleccionado",
    "Productions we've": "Producciones que hemos",
    "delivered.": "realizado.",
    "Network television, global digital creators, multilateral institutions and commercial agencies. Each project handled end-to-end from the ground in Panama.": "Televisión de cadena, creadores digitales globales, instituciones multilaterales y agencias comerciales. Cada proyecto gestionado de principio a fin desde Panamá.",
    "Selected work shown. Full references and reel available after first contact.": "Se muestra trabajo seleccionado. Referencias completas y reel disponibles tras el primer contacto.",
    "Digital · International": "Digital · Internacional",
    "Digital · International Creator": "Digital · Creador internacional",
    "MrBeast Production": "Producción de MrBeast",
    "USA (x3) · Canada · Australia · Finland": "EE. UU. (x3) · Canadá · Australia · Finlandia",
    "Reality Television · Network": "Telerrealidad · Cadena",
    "CBS's The Amazing Race — USA (x3) · Canada · Australia · Finland": "The Amazing Race de CBS — EE. UU. (x3) · Canadá · Australia · Finlandia",
    "Broadcast · Network": "Difusión · Cadena",
    "NBC's Today Show — Where in the World is Matt Lauer?": "Today Show de NBC — Where in the World is Matt Lauer?",
    "MTV's The Challenge": "The Challenge de MTV",
    "Series · Streaming": "Serie · Streaming",
    "Netflix's ARP": "ARP de Netflix",
    "Discovery's Survive the Raft": "Survive the Raft de Discovery",
    "Institutional · Multilateral": "Institucional · Multilateral",
    "OAS — 56th General Assembly, Panama 2026": "OEA — 56.ª Asamblea General, Panamá 2026",
    "IMAX Feature · Panama Canal": "Largometraje IMAX · Canal de Panamá",
    "The Complete Reel": "El reel completo",
    "Available Upon Request": "Disponible bajo solicitud",
    "Full Reference List": "Lista completa de referencias",
    "The complete reel is available upon request.": "El reel completo está disponible bajo solicitud.",
    "Credits include": "Créditos incluyen",
    "Beer-brand commercials": "Comerciales de marcas de cerveza",
    "From The Set": "Desde el set",
    "Behind": "Detrás",
    "the scenes.": "de cámaras.",
    "On location across Panama — tap any frame to enlarge.": "En locación por todo Panamá — toca cualquier imagen para ampliar.",

    // ── Services ──
    "How We Work": "Cómo trabajamos",
    "Three disciplines.": "Tres disciplinas.",
    "One production.": "Una producción.",
    "We're the executive arm of your production — we carry the operation, compliance and liability so your creative team can stay on the creative. The same team that scouts your location clears your permits and crews your shoot; that continuity is why international productions come back.": "Somos el brazo ejecutivo de tu producción — asumimos la operación, el cumplimiento y la responsabilidad para que tu equipo creativo se concentre en lo creativo. El mismo equipo que hace el scouting de tus locaciones tramita tus permisos y arma el crew de tu rodaje; esa continuidad es la razón por la que las producciones internacionales regresan.",
    "We Scout": "Scouting",
    "We Crew": "Crew",
    "We Clear": "Trámites",
    "Full crew, equipment and location management for international productions. We source talent, handle logistics and keep shoots on schedule from first scout to final wrap.": "Gestión integral de crew, equipo y locaciones para producciones internacionales. Conseguimos talento, manejamos la logística y mantenemos los rodajes en agenda desde el primer scouting hasta el wrap final.",
    "Permits, talent coordination, transport and on-ground support. We navigate local infrastructure so nothing surprises your team on day one.": "Permisos, coordinación de talento, transporte y soporte en tierra. Conocemos la infraestructura local para que nada sorprenda a tu equipo el primer día.",
    "Legal setup, insurance, customs and regulatory clearance for foreign productions. We protect your project — and your studio's liability — before the first frame rolls.": "Estructura legal, seguros, aduanas y trámites regulatorios para producciones extranjeras. Protegemos tu proyecto — y la responsabilidad de tu estudio — antes de que ruede el primer cuadro.",

    // ── Services · stats band ──
    "of the Americas": "de las Américas",
    "Direct flights to 90 cities across the Americas — 17 in the US — plus several in Europe. Your crew lands and works day one.": "Vuelos directos a 90 ciudades de las Américas — 17 en EE. UU. — y varias en Europa. Tu crew aterriza y trabaja el primer día.",
    "Cash rebate": "Rebate en efectivo",
    "Film Law 16: cash back on $500K+ in-country spend, plus customs exemptions and single-window permits. We provide the CPA and legal counsel to file it.": "Ley de Cine 16: reembolso en efectivo sobre gasto local desde $500K, además de exoneraciones aduaneras y permisos de ventanilla única. Aportamos el CPA y la asesoría legal para presentarlo.",

    // ── Services · incentives teaser ──
    "25% of your Panama spend, back in cash.": "El 25% de tu gasto en Panamá, de vuelta en efectivo.",
    "Panama's Film Law 16 returns 25% of qualifying in-country spend as cash — stacked with 0% equipment-import duty and single-window permits. As a licensed local partner, Verite Producciones structures the spend and files the claim so it actually lands.": "La Ley de Cine 16 de Panamá devuelve el 25% del gasto local elegible en efectivo — junto con 0% de arancel de importación de equipo y permisos de ventanilla única. Como socio local autorizado, Verite Producciones estructura el gasto y presenta el reclamo para que realmente llegue.",
    "Government incentives for international productions →": "Incentivos del Estado para producciones internacionales →",

    // ── Services · locations ──
    "Locations": "Locaciones",
    "Every backdrop,": "Cada escenario,",
    "one country.": "un país.",
    "Beaches, deserted islands, mountains, tropical jungle, raging rivers and waterfalls, barracks, former military bases and a modern, cosmopolitan capital with all its barrios and urban niches. Panama's versatility has been proven widely — and it's compact: Caribbean to Pacific in a little over an hour (82 km).": "Playas, islas desiertas, montañas, selva tropical, ríos caudalosos y cascadas, cuarteles, antiguas bases militares y una capital moderna y cosmopolita con todos sus barrios y rincones urbanos. La versatilidad de Panamá está ampliamente comprobada — y es compacta: del Caribe al Pacífico en poco más de una hora (82 km).",
    "Coast": "Costa",
    "Turquoise water and deserted islands — Bocas del Toro, the Pearl Islands, Pedasí. The look reality and campaign shoots keep coming back for.": "Aguas turquesas e islas desiertas — Bocas del Toro, las Islas Perlas, Pedasí. El look al que los realities y las campañas siguen regresando.",
    "Urban": "Urbano",
    "A modern skyline with distinct neighborhoods that stand in for metros across the Americas — glass towers to gritty backstreets.": "Un skyline moderno con barrios distintos que doblan como metrópolis de toda América — desde torres de cristal hasta callejones crudos.",
    "Wild": "Salvaje",
    "Tropical jungle, mountains, raging rivers and waterfalls — dense wilderness that sits minutes from a five-star base.": "Selva tropical, montañas, ríos caudalosos y cascadas — naturaleza densa a minutos de una base cinco estrellas.",
    "Maritime": "Marítimo",
    "The Panama Canal and working deep-water ports — industrial scale and maritime access found in almost no other single country.": "El Canal de Panamá y puertos de aguas profundas en operación — escala industrial y acceso marítimo que casi ningún otro país reúne.",
    "Heritage": "Patrimonio",
    "The UNESCO old town — cobblestone streets, Spanish-colonial façades and centuries of texture in a few walkable blocks.": "El casco antiguo Patrimonio de la UNESCO — calles empedradas, fachadas colonial-españolas y siglos de textura en pocas cuadras caminables.",
    "Access": "Acceso",
    "Hub of the Americas — direct flights to 90 cities across the Americas (17 in the US) and several in Europe, plus single-window customs. Crew and gear land and work day one.": "Hub de las Américas — vuelos directos a 90 ciudades de América (17 en EE. UU.) y varias en Europa, más aduana de ventanilla única. Crew y equipo aterrizan y trabajan el primer día.",

    // ── Services · weather ──
    "Weather": "Clima",
    "Shoot": "Roda",
    "365 days.": "365 días.",
    "366 days in leap years.": "366 días en años bisiestos.",
    "Panama's privileged position keeps it away from most tropical weather — mainly hurricanes. Its weather oscillates between dry and wet… very wet (that's why they call it the rain-forest). Live conditions across our primary filming regions:": "La posición privilegiada de Panamá lo mantiene al margen de la mayoría del clima tropical extremo — sobre todo huracanes. Su clima oscila entre seco y húmedo… muy húmedo (por algo le dicen selva tropical). Condiciones en vivo en nuestras principales regiones de rodaje:",
    "Filming days per year": "Días de rodaje al año",
    "Tropical climate with minimal weather disruption — consistent natural light year-round.": "Clima tropical con mínima interrupción por el tiempo — luz natural consistente todo el año.",
    "Panama time now": "Hora de Panamá",
    "Pacific · Urban": "Pacífico · Urbano",
    "Caribbean · Islands": "Caribe · Islas",
    "Highlands · Forest": "Tierras altas · Bosque",
    "Pacific · Coast": "Pacífico · Costa",
    "Live data · Open-Meteo": "Datos en vivo · Open-Meteo",
    "Dry Season": "Estación seca",
    "Late December to April — the prime window. El Niño and La Niña aside, reliable sun and calm seas.": "De fines de diciembre a abril — la mejor ventana. Salvo El Niño y La Niña, sol confiable y mar en calma.",
    "Green Season": "Estación verde",
    "Rains from early May to mid-December (September–October the wettest). Downpours are fast and furious, and can turn a somber sky into a bright day — with the magic-hour sunset that follows.": "Lluvias de principios de mayo a mediados de diciembre (septiembre–octubre las más intensas). Los aguaceros son rápidos e intensos, y pueden convertir un cielo gris en un día brillante — con el atardecer de hora mágica que le sigue.",
    "Daylight & Time": "Luz y horario",
    "Near the Equator: an almost even 12 hours of daylight. Upper-20s to mid-30s °C, humidity in the mid-80s. GMT−5.": "Cerca del Ecuador: casi 12 horas parejas de luz. Entre 28 y 35 °C, humedad cercana al 85%. GMT−5.",

    // ── Incentives page ──
    "Film Law 16 · Panama": "Ley de Cine 16 · Panamá",
    "Tax incentives for": "Incentivos fiscales para la",
    "film production in Panama.": "producción audiovisual en Panamá.",
    "A 25% cash rebate on qualifying in-country spend, 0% duty on imported equipment and single-window permitting — structured and filed by a licensed local partner so the incentive actually reaches your budget.": "Un rebate en efectivo del 25% sobre el gasto local elegible, 0% de arancel sobre equipo importado y permisos de ventanilla única — estructurado y presentado por un socio local autorizado para que el incentivo realmente llegue a tu presupuesto.",
    "Panama's Film Law 16 (2012) grants international productions a 25% cash rebate on qualifying in-country expenditure — alongside customs exemptions and single-window permitting. Verite Producciones is a licensed local partner registered with the Ministries of Culture and Commerce; we structure the spend and file the claim so the incentive actually lands.": "La Ley de Cine 16 (2012) de Panamá otorga a las producciones internacionales un rebate en efectivo del 25% sobre el gasto local elegible — junto con exoneraciones aduaneras y permisos de ventanilla única. Verite Producciones es un socio local autorizado registrado ante los Ministerios de Cultura y de Comercio; estructuramos el gasto y presentamos el reclamo para que el incentivo realmente llegue.",
    "Cash Rebate": "Rebate en efectivo",
    "On qualifying in-country spend from $500,000 USD, paid against your budget after wrap.": "Sobre gasto local elegible desde $500,000 USD, pagado contra tu presupuesto después del wrap.",
    "Import Duty": "Arancel de importación",
    "Duty-free temporary internment of all production equipment under Law 16.": "Internación temporal libre de aranceles de todo el equipo de producción bajo la Ley 16.",
    "Single Window": "Ventanilla única",
    "One-stop processing of both customs and labor permits at the Ministry of Commerce.": "Trámite en un solo lugar de los permisos de aduana y de trabajo en el Ministerio de Comercio.",
    "Per Week": "Por semana",
    "Film Commission fee from pre-production — and it credits back toward your rebate.": "Tarifa de la Comisión de Cine desde la preproducción — y se acredita a tu rebate.",
    "Partner with Verite Producciones": "Asóciate con Verite Producciones",
    "A licensed local company registered with the Ministries of Culture and Commerce — a legal requirement for the rebate.": "Una empresa local autorizada registrada ante los Ministerios de Cultura y de Comercio — un requisito legal para el rebate.",
    "Spend in-country": "Gasta localmente",
    "$500,000 USD or more across crew, equipment, locations and logistics.": "$500,000 USD o más en crew, equipo, locaciones y logística.",
    "We file it": "Lo presentamos",
    "Filed by Panama's most experienced, certified Cash Rebate accountants and auditors — every qualifying dollar counted — through legal counsel to the Ministry of Commerce & Industries.": "Presentado por los contadores y auditores de Cash Rebate más experimentados y certificados de Panamá — contando cada dólar elegible — mediante asesoría legal ante el Ministerio de Comercio e Industrias.",
    "25% back": "25% de vuelta",
    "Paid as cash against your qualified spend. We track every eligible dollar from day one.": "Pagado en efectivo contra tu gasto elegible. Rastreamos cada dólar elegible desde el primer día.",
    "What qualifies": "Qué califica",
    "Panamanian crew wages and per diems": "Salarios y viáticos de crew panameño",
    "Local equipment, vehicle and gear rental": "Alquiler local de equipo, vehículos y gear",
    "Location fees, permits and set services": "Tarifas de locación, permisos y servicios de set",
    "Hotels, ground transport and catering": "Hoteles, transporte terrestre y catering",
    "Post (DIT, File transmission) and lab services contracted in Panama": "Post (DIT, transmisión de archivos) y servicios de laboratorio contratados en Panamá",
    "Key details": "Datos clave",
    "$500,000 minimum qualifying spend": "Gasto elegible mínimo de $500,000",
    "Capped at $25M per project": "Tope de $25M por proyecto",
    "Filed through a licensed local producer — a legal requirement, and that's us": "Presentado a través de un productor local autorizado — un requisito legal, y ese somos nosotros",
    "Disbursed as cash after wrap, once the government compliance audit clears — a process that can take up to 36 months": "Desembolsado en efectivo después del wrap, una vez que aprueba la auditoría de cumplimiento del gobierno — un proceso que puede tomar hasta 36 meses",
    "That compliance audit is handled only by certified (CPA) accountants — we work with Panama's most experienced Cash Rebate auditors": "Esa auditoría de cumplimiento la realizan únicamente contadores certificados (CPA) — trabajamos con los auditores de Cash Rebate más experimentados de Panamá",
    "Stacks with 0% duty on temporarily imported equipment": "Se combina con 0% de arancel sobre equipo importado temporalmente",
    "Panama runs on the US dollar — no currency risk on your rebate": "Panamá opera con el dólar estadounidense — sin riesgo cambiario sobre tu rebate",

    // ── Resources ──
    "Know Panama": "Conoce Panamá",
    "before you commit.": "antes de comprometerte.",
    "Short field notes on producing in Panama — the 25% cash rebate and the law behind it, the permit and customs timeline, budgets, and where to point the camera. Written by the team that files the paperwork and runs the days.": "Notas breves de campo sobre producir en Panamá — el rebate del 25% y la ley detrás, los tiempos de permisos y aduanas, presupuestos y dónde apuntar la cámara. Escritas por el equipo que presenta el papeleo y maneja los días de rodaje.",
    "Legal & Incentives": "Legal e incentivos",
    "The 25% Cash Rebate, Explained": "El rebate en efectivo del 25%, explicado",
    "Film Law 16 in plain English: who qualifies, what spend counts, how the money comes back, and what Verite files so it reaches your budget.": "La Ley de Cine 16 en palabras simples: quién califica, qué gasto cuenta, cómo vuelve el dinero y qué presenta Verite para que llegue a tu presupuesto.",
    "Read": "Leer",
    "Field Guide": "Guía de campo",
    "The International Producer's Guide to Panama": "La guía del productor internacional para Panamá",
    "Geography, weather and the shooting calendar, locations coast to coast, and the crew depth behind 30 years of international productions.": "Geografía, clima y calendario de rodaje, locaciones de costa a costa, y la profundidad de crew detrás de 30 años de producciones internacionales.",
    "Wouldn't you rather just talk it thru? Reach out to Ricky Barria at": "¿Prefieres conversarlo directamente? Escríbele a Ricky Barria a",
    "← Resources": "← Recursos",

    // ── Essay: 25% rebate ──
    "The 25% Cash Rebate,": "El rebate en efectivo del 25%,",
    "explained.": "explicado.",
    "Panama pays back 25% of what an international production spends inside the country, in cash, under Film Law 16 of 2023. It covers qualifying local spend, it has a $25M cap per project, and Verite files the compliance paperwork so you don't have to learn the statute to claim it.": "Panamá devuelve el 25% de lo que una producción internacional gasta dentro del país, en efectivo, bajo la Ley de Cine 16 de 2023. Cubre el gasto local elegible, tiene un tope de $25M por proyecto, y Verite presenta el papeleo de cumplimiento para que no tengas que aprenderte la ley para reclamarlo.",
    "Who qualifies": "Quién califica",
    "Foreign and local productions that register through the film commission and route a minimum qualifying spend through Panamanian vendors, crew and services. We open the incentive file at the start of prep, not at wrap — that's how the claim stays clean.": "Producciones extranjeras y locales que se registran ante la comisión de cine y canalizan un gasto elegible mínimo a través de proveedores, crew y servicios panameños. Abrimos el expediente del incentivo al inicio de la preproducción, no en el wrap — así se mantiene limpio el reclamo.",
    "What spend counts": "Qué gasto cuenta",
    "Local crew, equipment rental, hotels, ground transport, locations and post finished in-country. Anything invoiced by a Panamanian vendor and paid through the production's local accounts is on the table; foreign per-diems and gear you fly in on a carnet are not. We tag every line as qualifying or not from the first budget draft so the number you model is the number you claim.": "Crew local, alquiler de equipo, hoteles, transporte terrestre, locaciones y post terminada en el país. Todo lo facturado por un proveedor panameño y pagado a través de las cuentas locales de la producción cuenta; los viáticos extranjeros y el equipo que traes con carnet no. Etiquetamos cada línea como elegible o no desde el primer borrador de presupuesto, para que el número que modelas sea el número que reclamas.",
    "How the money comes back": "Cómo vuelve el dinero",
    "Register the project, shoot, close the books, pass the audit, get paid. Be clear-eyed about the timing: the payout can take up to 36 months after the audit closes, so we treat the 25% as recovery you plan around rather than cash in hand on wrap day. On a real budget that timing matters more than the headline rate, and we build it into the cash-flow from the start so nobody is surprised.": "Registra el proyecto, roda, cierra los libros, pasa la auditoría, cobra. Sé realista con los tiempos: el pago puede tomar hasta 36 meses después de que cierra la auditoría, así que tratamos el 25% como una recuperación que planificas, no como efectivo en mano el día del wrap. En un presupuesto real, ese tiempo importa más que la tasa titular, y lo integramos al flujo de caja desde el inicio para que nadie se sorprenda.",
    "Key details worth knowing": "Datos clave que conviene saber",
    "A certified (CPA) compliance audit is mandatory, and the $25M cap is per project. Keep the receipts, keep the vendors registered, and keep the paperwork current from day one — the moment a receipt goes missing is the moment the rebate shrinks. We build the claim from the first call sheet forward so nothing gets disallowed at the end.": "Una auditoría de cumplimiento certificada (CPA) es obligatoria, y el tope de $25M es por proyecto. Guarda los recibos, mantén a los proveedores registrados y el papeleo al día desde el primer día — el momento en que se pierde un recibo es el momento en que el rebate se encoge. Construimos el reclamo desde el primer call sheet para que nada se descarte al final.",
    "What Verite handles": "Qué maneja Verite",
    "Registration, the vendor and payroll trail, the audit coordination and the filing. You run the show; we run the compliance and liability that sit under it. That's the part that turns a line in the tax code into money that actually reaches your budget.": "El registro, el rastro de proveedores y planilla, la coordinación de la auditoría y la presentación. Tú diriges el show; nosotros manejamos el cumplimiento y la responsabilidad que lo sostienen. Esa es la parte que convierte una línea del código fiscal en dinero que realmente llega a tu presupuesto.",
    "Email": "Correo",

    // ── Essay: producer's guide ──
    "Logistics & Locations": "Logística y locaciones",
    "The international producer's": "La guía del productor",
    "guide to Panama.": "internacional para Panamá.",
    "One small country doubles for a dozen on screen. Panama gives you Caribbean and Pacific coasts an hour apart, jungle, a colonial old town, a modern skyline and the Canal — plus a crew base that's been servicing international productions since 1993.": "Un país pequeño dobla como una docena en pantalla. Panamá te da costas del Caribe y del Pacífico a una hora de distancia, selva, un casco colonial, un skyline moderno y el Canal — además de una base de crew que da servicio a producciones internacionales desde 1993.",
    "The geography advantage": "La ventaja geográfica",
    "Bocas del Toro on the Caribbean, the Boquete highlands, Pedasí on the Pacific, and Panama City — most of them reachable in a day. You can carry three looks in one schedule without a company move across a border. Caribbean to Pacific is a little over an hour by air, 82 km at the narrowest, which is why a single unit can chase very different backdrops in the same week.": "Bocas del Toro en el Caribe, las tierras altas de Boquete, Pedasí en el Pacífico, y la Ciudad de Panamá — la mayoría alcanzables en un día. Puedes llevar tres looks en un mismo cronograma sin un company move cruzando una frontera. Del Caribe al Pacífico es poco más de una hora por aire, 82 km en su punto más angosto, por eso una sola unidad puede perseguir escenarios muy distintos en la misma semana.",
    "Weather and the shooting calendar": "El clima y el calendario de rodaje",
    "Roughly 270 filming days a year. The dry season runs December to April with hard tropical light; the green season brings afternoon rain that clears fast and leaves the jungle at its richest. Because you have two coasts, you can usually shoot around a front rather than lose the day — when the Pacific side is grey, the Caribbean side often isn't. We plan schedules to the weather windows, not against them.": "Unos 270 días de rodaje al año. La estación seca va de diciembre a abril con luz tropical dura; la estación verde trae lluvia de tarde que despeja rápido y deja la selva en su punto más exuberante. Como tienes dos costas, por lo general puedes rodar alrededor de un frente en vez de perder el día — cuando el lado Pacífico está gris, el lado Caribe muchas veces no lo está. Planificamos los cronogramas según las ventanas de clima, no contra ellas.",
    "Locations, coast to coast": "Locaciones, de costa a costa",
    "Bocas del Toro for turquoise water and stilt villages. Boquete for cloud forest and highland green. Pedasí and the Azuero for dry Pacific coast and open ranchland. Casco Viejo for colonial stone that reads as old Havana or Cartagena. The banking skyline for a modern capital, and the Canal for scale you can't fake. Each backdrop doubles for somewhere more expensive to reach — that's the whole pitch.": "Bocas del Toro para aguas turquesas y pueblos palafíticos. Boquete para bosque nuboso y verde de altura. Pedasí y el Azuero para costa seca del Pacífico y campo abierto. Casco Viejo para piedra colonial que lee como la vieja Habana o Cartagena. El skyline bancario para una capital moderna, y el Canal para una escala que no se puede fingir. Cada escenario dobla por un lugar más caro de alcanzar — ese es todo el argumento.",
    "Crew and infrastructure": "Crew e infraestructura",
    "English-speaking department heads, Tocumen as a direct-flight hub for the Americas and Europe, a US-dollar economy, and no currency conversion to manage. The pieces a foreign production usually has to import — grip and electric, camera support, transport, fixers — are already on the ground. We staff local first and only bring in what genuinely can't be sourced here.": "Jefes de departamento que hablan inglés, Tocumen como hub de vuelos directos hacia América y Europa, una economía en dólares y sin conversión de moneda que administrar. Las piezas que una producción extranjera suele tener que importar — grip y electricidad, soporte de cámara, transporte, fixers — ya están en tierra. Contratamos local primero y solo traemos lo que realmente no se consigue aquí.",
    "Why producers come back": "Por qué los productores regresan",
    "CBS's The Amazing Race, Discovery's Survive the Raft, MTV's The Challenge, Netflix, NBC's Today Show and four MrBeast productions have all shot here with the same ground team. The continuity is the point: the crew that scouts your location clears your permits and runs your days.": "The Amazing Race de CBS, Survive the Raft de Discovery, The Challenge de MTV, Netflix, el Today Show de NBC y cuatro producciones de MrBeast han rodado aquí con el mismo equipo en tierra. La continuidad es el punto: el crew que hace el scouting de tu locación tramita tus permisos y maneja tus días.",

    // ── Contact (Get in Touch hero) ──
    "Panama · Since 1993": "Panamá · Desde 1993",
    "Panama's foremost": "El principal socio de servicios de",
    "Production Service partner.": "producción de Panamá.",
    "Full-service logistics. For over 30 years, the ground team behind the country's largest international and local productions.": "Logística integral. Desde hace más de 30 años, el equipo en tierra detrás de las mayores producciones internacionales y locales del país.",
    "Direct Contact": "Contacto directo",
    "Office": "Oficina",
    "Location": "Ubicación",

    // ── Contact form ──
    "Production Type": "Tipo de producción",
    "Select": "Seleccionar",
    "Commercial": "Comercial",
    "Documentary": "Documental",
    "Reality TV": "Telerrealidad",
    "Music Video": "Video musical",
    "Other": "Otro",
    "Crew Size": "Tamaño del crew",
    "Name": "Nombre",
    "Company": "Empresa",
    "Estimated Shoot Dates": "Fechas estimadas de rodaje",
    "Brief": "Brief",
    "Submit Request →": "Enviar solicitud →",
    "Data protection & compliance — the personal data you send here is processed under Panama's Law 81 of 2019 on the Protection of Personal Data (habeas data). We use it only to respond to your enquiry, keep it secured, and never sell or pass it on; you can ask us to access, correct or delete it at any time. On productions we handle crew and talent data — releases, IDs and cross-border transfers — to the same standard.": "Protección de datos y cumplimiento — los datos personales que envías aquí se tratan bajo la Ley 81 de 2019 de Panamá sobre Protección de Datos Personales (habeas data). Los usamos solo para responder tu consulta, los mantenemos seguros y nunca los vendemos ni cedemos; puedes pedirnos acceder, corregir o eliminarlos en cualquier momento. En producciones manejamos datos de crew y talento — releases, identificaciones y transferencias transfronterizas — con el mismo estándar.",

    // ── Download gate ──
    "Complimentary Guide": "Guía de cortesía",
    "Guide": "Guía",
    "Tell us where to send it — your copy lands in your inbox.": "Dinos a dónde enviarla — tu copia llega a tu correo.",
    "Email me the guide": "Envíenme la guía",
    "By requesting, you agree we may contact you about your production. Unsubscribe anytime.": "Al solicitarla, aceptas que podamos contactarte sobre tu producción. Cancela cuando quieras.",
    "On its way.": "En camino.",
    "Your mail app just opened with the request — send it and we'll email the guide straight back.": "Tu app de correo se abrió con la solicitud — envíala y te responderemos con la guía enseguida.",

    // ── Placeholders (form attributes) ──
    "Your full name": "Tu nombre completo",
    "Production company": "Casa productora",
    "e.g. October 2025, TBD": "p. ej. octubre 2025, por definir",
    "you@studio.com": "tu@estudio.com",
    "Tell us about the project — format, scope, locations in mind": "Cuéntanos del proyecto — formato, alcance, locaciones en mente",
    "Full name": "Nombre completo",
    "Work email": "Correo de trabajo",
    "Production / company (optional)": "Producción / empresa (opcional)",

    // ── Element-level overrides (data-i18n) ──
    "@svc1": "Servicios de <em>producción</em>",
    "@svc2": "Fixer <em>y logística</em>",
    "@svc3": "Cumplimiento <em>ejecutivo</em>"
  };

  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1 };
  var SKIP_SEL = "[data-temp],[data-cond],[data-ico],#wx-clock,[data-lang-btn]";

  function norm(s) { return s.replace(/\s+/g, " ").trim(); }

  var textNodes = null, attrEls = null, overrideEls = null;

  function collect() {
    textNodes = []; attrEls = []; overrideEls = [];
    var skip = {}, i, list;
    list = document.querySelectorAll(SKIP_SEL);
    for (i = 0; i < list.length; i++) skip[nodeId(list[i])] = 1;
    var overrides = document.querySelectorAll("[data-i18n]");
    var overrideSet = {};
    for (i = 0; i < overrides.length; i++) {
      overrideSet[nodeId(overrides[i])] = 1;
      overrideEls.push({ el: overrides[i], slug: overrides[i].getAttribute("data-i18n"), en: overrides[i].innerHTML });
    }
    function walk(node) {
      var n = node.firstChild;
      while (n) {
        if (n.nodeType === 3) {
          var raw = n.nodeValue;
          if (raw && /\S/.test(raw) && /[A-Za-zÀ-ÿ]/.test(raw)) textNodes.push({ node: n, en: raw });
        } else if (n.nodeType === 1) {
          var tag = n.tagName;
          if (!SKIP_TAGS[tag] && tag !== "svg" && tag !== "path" &&
              !skip[nodeId(n)] && !overrideSet[nodeId(n)]) {
            walk(n);
          }
        }
        n = n.nextSibling;
      }
    }
    walk(document.body);
    list = document.querySelectorAll("[placeholder]");
    for (i = 0; i < list.length; i++) attrEls.push({ el: list[i], en: list[i].getAttribute("placeholder") });
  }

  var _id = 0;
  function nodeId(el) { return el.__i18nId || (el.__i18nId = ++_id); }

  function apply(lang) {
    if (!textNodes) collect();
    var es = (lang === "es");
    var i, t;
    for (i = 0; i < textNodes.length; i++) {
      t = textNodes[i];
      if (!es) { t.node.nodeValue = t.en; continue; }
      var v = ES[norm(t.en)];
      if (v !== undefined) {
        var lead = t.en.match(/^\s*/)[0], trail = t.en.match(/\s*$/)[0];
        t.node.nodeValue = lead + v + trail;
      } else { t.node.nodeValue = t.en; }
    }
    for (i = 0; i < overrideEls.length; i++) {
      t = overrideEls[i];
      var ov = ES["@" + t.slug];
      t.el.innerHTML = (es && ov !== undefined) ? ov : t.en;
    }
    for (i = 0; i < attrEls.length; i++) {
      t = attrEls[i];
      var pv = ES[norm(t.en)];
      t.el.setAttribute("placeholder", (es && pv !== undefined) ? pv : t.en);
    }
    document.documentElement.lang = lang;
    window.__lang = lang;
    // toggle button state (both nav + mobile instances)
    var btns = document.querySelectorAll("[data-lang-btn]");
    for (i = 0; i < btns.length; i++) btns[i].classList.toggle("active", btns[i].getAttribute("data-lang-btn") === lang);
    // canonical / og for the /es/ variant
    var canon = document.querySelector('link[rel="canonical"]');
    var ogurl = document.querySelector('meta[property="og:url"]');
    var ogloc = document.querySelector('meta[property="og:locale"]');
    var base = "https://www.shootinginpanama.com/";
    if (canon) canon.setAttribute("href", es ? base + "es/" : base);
    if (ogurl) ogurl.setAttribute("content", es ? base + "es/" : base);
    if (ogloc) ogloc.setAttribute("content", es ? "es_PA" : "en_US");
    try { localStorage.setItem("vrt_lang", lang); } catch (e) {}
  }

  function pathIsEs() { return location.pathname.indexOf("/es") === 0; }

  // Initial language: saved choice > /es/ path > English
  var initial = "en";
  try { var saved = localStorage.getItem("vrt_lang"); if (saved === "es" || saved === "en") initial = saved; else if (pathIsEs()) initial = "es"; }
  catch (e) { if (pathIsEs()) initial = "es"; }

  // Toggle handler (delegated; works for nav + mobile instances)
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-lang-btn]") : null;
    if (!b) return;
    var lang = b.getAttribute("data-lang-btn");
    apply(lang);
    try { history.replaceState(null, "", (lang === "es" ? "/es/" : "/") + location.hash); } catch (_) {}
  });

  apply(initial);
  window.applyLang = apply;
})();
