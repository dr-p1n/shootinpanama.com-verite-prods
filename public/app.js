  // ── PAGE ROUTING ──
  const pages = ['home','work','services','incentives','resources','contact'];

  function showPage(id) {
    document.querySelectorAll('.essay.active').forEach(el => el.classList.remove('active'));
    pages.forEach(p => {
      document.getElementById('page-' + p).classList.remove('active');
      const btn = document.getElementById('nav-' + p);
      if(btn) btn.classList.remove('active');
    });
    document.getElementById('page-' + id).classList.add('active');
    const btn = document.getElementById('nav-' + id);
    if(btn) btn.classList.add('active');
    // Sync mobile menu highlight + close it on navigation
    document.querySelectorAll('.mobile-link').forEach(l => l.classList.remove('active'));
    const mIdx = pages.indexOf(id);
    const mLinks = document.querySelectorAll('.mobile-link');
    if(mIdx > -1 && mLinks[mIdx]) mLinks[mIdx].classList.add('active');
    toggleMenu(false);
    window.scrollTo({top:0,behavior:'instant'});
    // Trigger reveals on new page
    setTimeout(() => initReveal(), 50);
    // Update URL hash
    history.pushState(null, '', '#' + id);
  }

  // ── ESSAY READER (sub-pages under Resources) ──
  function showEssay(slug) {
    const el = document.getElementById('essay-' + slug);
    if(!el) return;
    pages.forEach(p => {
      document.getElementById('page-' + p).classList.remove('active');
      const btn = document.getElementById('nav-' + p);
      if(btn) btn.classList.remove('active');
    });
    document.querySelectorAll('.essay.active').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    // Essays live under Resources — keep that nav item lit for orientation
    const rb = document.getElementById('nav-resources');
    if(rb) rb.classList.add('active');
    document.querySelectorAll('.mobile-link').forEach(l => l.classList.remove('active'));
    const mLinks = document.querySelectorAll('.mobile-link');
    const rIdx = pages.indexOf('resources');
    if(rIdx > -1 && mLinks[rIdx]) mLinks[rIdx].classList.add('active');
    toggleMenu(false);
    window.scrollTo({top:0,behavior:'instant'});
    setTimeout(() => initReveal(), 50);
    history.pushState(null, '', '#essay-' + slug);
  }

  function route(hash) {
    if(hash.indexOf('essay-') === 0 && document.getElementById('essay-' + hash.slice(6))) { showEssay(hash.slice(6)); return; }
    if(pages.includes(hash)) showPage(hash);
  }

  // Handle back/forward
  window.addEventListener('popstate', () => {
    route(location.hash.replace('#','') || 'home');
  });

  // Init from URL hash
  route(location.hash.replace('#','') || 'home');

  // ── LIVE WEATHER (Open-Meteo, keyless) ──
  (function(){
    const cards = [...document.querySelectorAll('#wx-grid .wx-card')];
    if(!cards.length) return;
    const lat = cards.map(c => c.dataset.lat).join(',');
    const lon = cards.map(c => c.dataset.lon).join(',');
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
      '&current=temperature_2m,weather_code&timezone=auto';
    const wmo = code => {
      if(code === 0) return ['☀︎','Clear'];
      if(code <= 2) return ['⛅︎','Partly cloudy'];
      if(code === 3) return ['☁︎','Overcast'];
      if(code <= 48) return ['🌫︎','Fog'];
      if(code <= 57) return ['🌦︎','Drizzle'];
      if(code <= 67) return ['🌧︎','Rain'];
      if(code <= 82) return ['🌦︎','Showers'];
      return ['⛈︎','Thunderstorm'];
    };
    fetch(url).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(data => {
      const arr = Array.isArray(data) ? data : [data];
      cards.forEach((card, i) => {
        const cur = arr[i] && arr[i].current;
        if(!cur) return;
        const [ico, label] = wmo(cur.weather_code);
        card.querySelector('[data-temp]').innerHTML = Math.round(cur.temperature_2m) + '<sup>°C</sup>';
        card.querySelector('[data-ico]').textContent = ico;
        card.querySelector('[data-cond]').textContent = label;
      });
    }).catch(() => {
      cards.forEach(card => { card.querySelector('[data-cond]').textContent = 'Live data unavailable'; });
    });
  })();

  // ── MOBILE MENU ──
  function toggleMenu(force) {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.getElementById('navToggle');
    const open = (typeof force === 'boolean') ? force : !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  // Close menu on Escape
  document.addEventListener('keydown', e => { if(e.key === 'Escape') toggleMenu(false); });

  // ── NAV SCROLL ──
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), {passive:true});

  // ── REVEAL ON SCROLL ──
  function initReveal() {
    const els = document.querySelectorAll('.page.active .reveal:not(.in), .essay.active .reveal:not(.in)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(!e.isIntersecting) return;
        const peers = [...e.target.parentElement.querySelectorAll('.reveal')];
        e.target.style.transitionDelay = (peers.indexOf(e.target) * 0.07) + 's';
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, {threshold:.1, rootMargin:'0px 0px -30px 0px'});
    els.forEach(el => io.observe(el));
  }
  initReveal();

  // ── DOWNLOAD GATE (lead capture) ──
  // Paste the Google Apps Script Web App /exec URL here to log leads to the sheet.
  // Leave blank and the form falls back to an email request instead.
  const LEAD_ENDPOINT = '';
  const gate = document.getElementById('gate');
  let gateDoc = '';
  function openGate(name) {
    gateDoc = name;
    document.getElementById('gate-title').textContent = name;
    document.getElementById('gate-body').hidden = false;
    document.getElementById('gate-done').hidden = true;
    document.getElementById('gate-form').reset();
    gate.classList.add('open');
    gate.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const f = gate.querySelector('input[name=fullname]'); if (f) f.focus(); }, 320);
  }
  function closeGate() {
    gate.classList.remove('open');
    gate.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function submitGate(e) {
    e.preventDefault();
    const f = e.target;
    const name = f.elements.fullname.value.trim();
    const email = f.elements.email.value.trim();
    const company = f.elements.company.value.trim();
    const donePara = document.querySelector('#gate-done .gate-success-p');
    if (LEAD_ENDPOINT) {
      // Log the lead straight to the Google Sheet (no-cors avoids a preflight).
      const params = new URLSearchParams({ guide: gateDoc, name, email, company, source: 'resources' });
      fetch(LEAD_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      }).catch(() => {});
      donePara.textContent = 'Thanks, ' + (name.split(' ')[0] || 'there') + ' — your copy of “' + gateDoc + '” is on its way to ' + email + '.';
    } else {
      // Fallback until the Sheet endpoint is set: email the request.
      const subject = encodeURIComponent('Guide download — ' + gateDoc);
      const body = encodeURIComponent(
        'New guide request from the Resources page.\n\n' +
        'Guide: ' + gateDoc + '\n' +
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Production / company: ' + (company || '—') + '\n'
      );
      window.location.href = 'mailto:rbarria@veriteproducciones.net?subject=' + subject + '&body=' + body;
      donePara.textContent = 'Your mail app just opened with the request — send it and we\'ll email the guide straight back.';
    }
    document.getElementById('gate-body').hidden = true;
    document.getElementById('gate-done').hidden = false;
    return false;
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && gate.classList.contains('open')) closeGate(); });

  // ── LIGHTBOX (Work contact sheet) ──
  const lb = (function () {
    const el = document.getElementById('lb');
    const img = document.getElementById('lb-img');
    const count = document.getElementById('lb-count');
    // Two independent collections share this one overlay: BTS gallery + location cards.
    // Each cycles within its own set; the counter reflects the active collection.
    const build = (sel) => [...document.querySelectorAll(sel)]
      .map(c => ({ el: c, webp: c.dataset.full, jpg: c.dataset.fulljpg }))
      .filter(it => it.webp || it.jpg);
    [build('#cs .cs-cell'), build('.loc-card')].forEach(list =>
      list.forEach((it, idx) => it.el.addEventListener('click', () => open(list, idx))));
    let items = [];
    let i = 0;
    function show() {
      const it = items[i];
      img.classList.remove('ready');
      img.onerror = () => { img.onerror = null; img.src = it.jpg; };
      img.onload = () => img.classList.add('ready');
      img.src = it.webp || it.jpg;
      count.textContent = String(i + 1).padStart(2, '0') + ' / ' + items.length;
      // preload neighbours
      [items[(i + 1) % items.length], items[(i - 1 + items.length) % items.length]]
        .forEach(n => { const p = new Image(); p.src = n.webp || n.jpg; });
    }
    function open(list, n) {
      items = list; i = n; show();
      el.classList.add('open');
      el.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lb-open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      el.classList.remove('open');
      el.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lb-open');
      document.body.style.overflow = '';
    }
    function next() { if (!items.length) return; i = (i + 1) % items.length; show(); }
    function prev() { if (!items.length) return; i = (i - 1 + items.length) % items.length; show(); }
    // Controls
    el.querySelector('.lb-close').addEventListener('click', close);
    el.querySelector('.lb-prev').addEventListener('click', prev);
    el.querySelector('.lb-next').addEventListener('click', next);
    // Click backdrop closes; click image advances
    el.addEventListener('click', (e) => { if (e.target === el) close(); });
    img.addEventListener('click', next);
    document.addEventListener('keydown', (e) => {
      if (!el.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    });
    return { open, close, next, prev };
  })();

  // Live Panama local time (America/Panama — no external calls)
  (function () {
    const el = document.getElementById('wx-clock');
    if (!el) return;
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Panama', hour: 'numeric', minute: '2-digit', hour12: true });
    const tick = () => { el.textContent = fmt.format(new Date()) + ' · GMT−5'; };
    tick();
    setInterval(tick, 15000);
  })();

/* ── Event wiring (replaces former inline handlers) ── */
document.addEventListener('click', (e) => {
  const nav = e.target.closest('[data-page]');
  if (nav) { if (nav.tagName === 'A') e.preventDefault(); showPage(nav.dataset.page); return; }
  const es = e.target.closest('[data-essay]');
  if (es) { showEssay(es.dataset.essay); return; }
  const g = e.target.closest('[data-guide]');
  if (g) { openGate(g.dataset.guide); return; }
  const s = e.target.closest('[data-scroll]');
  if (s) { const t = document.getElementById(s.dataset.scroll); if (t) t.scrollIntoView({behavior:'smooth'}); return; }
  if (e.target.closest('[data-gate-close]')) { closeGate(); return; }
});
var _navToggle = document.getElementById('navToggle');
if (_navToggle) _navToggle.addEventListener('click', function(){ toggleMenu(); });
var _gateForm = document.getElementById('gate-form');
if (_gateForm) _gateForm.addEventListener('submit', submitGate);

/* ── RFQ (Get in Touch) form → POST /api/lead, with mailto fallback ── */
var _rfqBtn = document.querySelector('.submit-btn');
if (_rfqBtn) _rfqBtn.addEventListener('click', function () {
  var g = function (id) { var el = document.getElementById(id); return el ? (el.value || '').trim() : ''; };
  var lead = {
    kind: 'rfq', name: g('fname'), email: g('email'), company: g('company'),
    type: g('prod-type'), crew: g('crew-size'), dates: g('dates'), brief: g('message'),
    lang: window.__lang || 'en', website: g('rfq-hp')
  };
  var es = (window.__lang === 'es');
  var emailField = document.getElementById('email');
  if (!lead.email && emailField) { emailField.focus(); emailField.style.borderColor = '#C9541E'; return; }

  function mailtoFallback() {
    var subject = encodeURIComponent('Production enquiry — ' + (lead.company || lead.name || 'Shoot In Panama'));
    var body = encodeURIComponent(
      'New production enquiry from shootinginpanama.com\n\n' +
      'Name: ' + lead.name + '\nCompany: ' + lead.company + '\nEmail: ' + lead.email + '\n' +
      'Production type: ' + lead.type + '\nCrew size: ' + lead.crew + '\nEstimated shoot dates: ' + lead.dates + '\n\n' +
      'Brief:\n' + (lead.brief || '—') + '\n'
    );
    window.location.href = 'mailto:rbarria@veriteproducciones.net?subject=' + subject + '&body=' + body;
    _rfqBtn.textContent = es ? 'Abriendo tu correo…' : 'Opening your email…';
  }

  _rfqBtn.disabled = true;
  _rfqBtn.textContent = es ? 'Enviando…' : 'Sending…';
  fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(lead) })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (d) {
      if (d && d.ok) { _rfqBtn.textContent = es ? '¡Gracias! Te contactamos pronto.' : "Thank you — we'll be in touch."; }
      else { _rfqBtn.disabled = false; mailtoFallback(); }
    })
    .catch(function () { _rfqBtn.disabled = false; mailtoFallback(); });
});

