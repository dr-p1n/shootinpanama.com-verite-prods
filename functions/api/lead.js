// POST /api/lead — receives RFQ / guide submissions.
// Saves each lead to KV (binding: LEADS), emails it via Resend (RESEND_API_KEY) and forwards it to the
// Verite Worker (LEAD_FORWARD_SECRET), which saves it in the admin database and in the Sheet tab "Shoot in Panama".
// Returns { ok:true } if it stored, emailed or forwarded; { ok:false } (503) if nothing is
// configured yet, so the front-end can fall back to a mailto: link.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// A reference derived from the lead itself (time + e-mail), so sending the same lead again, or importing it later from
// KV, always gives the same SIP-XXXXXX and the Worker never writes it twice. Same alphabet as the Worker (no O/0, I/1/L).
const REF_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
async function leadRef(lead) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(lead.ts + "|" + lead.email));
  const b = new Uint8Array(d);
  let out = "SIP-";
  for (let i = 0; i < 6; i++) out += REF_CHARS[b[i] % REF_CHARS.length];
  return out;
}
function s(v) { return (v == null ? "" : String(v)).replace(/\s+/g, " ").trim().slice(0, 5000); }

function renderText(l) {
  return [
    "New " + (l.kind === "guide" ? "guide request" : "production enquiry") + " from shootinginpanama.com",
    "",
    "Name: " + l.name,
    "Company: " + l.company,
    "Email: " + l.email,
    l.type ? "Production type: " + l.type : null,
    l.crew ? "Crew size: " + l.crew : null,
    l.dates ? "Estimated dates: " + l.dates : null,
    l.guide ? "Guide: " + l.guide : null,
    l.lang ? "Site language: " + l.lang : null,
    "",
    "Brief:",
    l.brief || "—",
    "",
    "— sent " + l.ts + (l.ip ? " · " + l.ip : ""),
  ].filter(function (x) { return x !== null; }).join("\n");
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let raw = {};
  try {
    const ct = request.headers.get("content-type") || "";
    if (ct.indexOf("application/json") !== -1) raw = await request.json();
    else { const fd = await request.formData(); fd.forEach(function (v, k) { raw[k] = v; }); }
  } catch (e) { return json({ ok: false, error: "bad_request" }, 400); }

  // Honeypot: real users never fill this hidden field.
  if (s(raw.website)) return json({ ok: true, stored: false, emailed: false });

  const lead = {
    ts: new Date().toISOString(),
    kind: s(raw.kind) || "rfq",
    name: s(raw.name),
    email: s(raw.email),
    company: s(raw.company),
    type: s(raw.type),
    crew: s(raw.crew),
    dates: s(raw.dates),
    brief: s(raw.brief),
    guide: s(raw.guide),
    lang: s(raw.lang),
    ua: s(request.headers.get("user-agent")),
    ip: s(request.headers.get("cf-connecting-ip")),
  };

  if (!lead.email || !EMAIL_RE.test(lead.email)) return json({ ok: false, error: "email_required" }, 422);

  let stored = false, emailed = false, forwarded = false, sheeted = false, emailErr = null, forwardErr = null;

  // 1) Durable store — never lose a lead.
  if (env.LEADS) {
    try {
      const key = "lead:" + Date.now() + ":" + Math.random().toString(36).slice(2, 8);
      await env.LEADS.put(key, JSON.stringify(lead), {
        metadata: { email: lead.email, kind: lead.kind, ts: lead.ts, company: lead.company },
      });
      stored = true;
    } catch (e) { /* fall through */ }
  }

  // 2) Notify via Resend (only once the key is configured).
  if (env.RESEND_API_KEY) {
    try {
      const from = env.LEAD_FROM || "Shoot In Panama <leads@shootinginpanama.com>";
      const to = env.LEAD_TO || "rbarria@veriteproducciones.net";
      const subject = (lead.kind === "guide" ? "Guide request" : "Production enquiry") +
        " — " + (lead.company || lead.name || "shootinginpanama.com");
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" },
        body: JSON.stringify({ from: from, to: [to], reply_to: lead.email, subject: subject, text: renderText(lead) }),
      });
      emailed = res.ok;
      if (!res.ok) emailErr = "resend_" + res.status;
    } catch (e) { emailErr = "resend_exception"; }
  }

  // 3) Forward to the Verite Worker: it saves the lead in D1 (the admin shows it under Shoot in Panama) and writes
  //    the row in the Sheet tab "Shoot in Panama". KV and the e-mail above already hold the lead, so a failure here loses
  //    nothing; sending the same lead again is safe (same reference). IP and user agent are not forwarded.
  if (env.LEAD_FORWARD_SECRET) {
    try {
      const url = env.LEAD_FORWARD_URL || "https://verite-sip.julioernestolv.workers.dev/api/sip-lead";
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", "x-lead-secret": env.LEAD_FORWARD_SECRET },
        body: JSON.stringify({
          ref: await leadRef(lead), ts: lead.ts, kind: lead.kind, name: lead.name, email: lead.email, company: lead.company,
          type: lead.type, crew: lead.crew, dates: lead.dates, brief: lead.brief, guide: lead.guide, lang: lead.lang,
        }),
        signal: AbortSignal.timeout(8000),
      });
      forwarded = res.ok;
      if (!res.ok) forwardErr = "forward_" + res.status;
    } catch (e) { forwardErr = "forward_exception"; }
  }

  // 4) Old backup, off unless SHEET_ENDPOINT is set: append to the previous Google Sheet (Apps Script Web App).
  //    Server-to-server, so no CSP/CORS concerns. Leave it unset: the old Sheet's account ran out of storage.
  if (env.SHEET_ENDPOINT) {
    try {
      const res = await fetch(env.SHEET_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
      sheeted = res.ok;
    } catch (e) { /* ignore */ }
  }

  if (stored || emailed || forwarded || sheeted) {
    return json({ ok: true, stored: stored, emailed: emailed, forwarded: forwarded, sheeted: sheeted, emailErr: emailErr, forwardErr: forwardErr });
  }
  // Nothing configured yet → tell the client to use the mailto fallback.
  return json({ ok: false, error: "unconfigured" }, 503);
}

// Reject non-POST.
export async function onRequest(context) {
  if (context.request.method === "POST") return onRequestPost(context);
  return json({ ok: false, error: "method_not_allowed" }, 405);
}
