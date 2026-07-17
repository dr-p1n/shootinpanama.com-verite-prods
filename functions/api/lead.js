// POST /api/lead — receives RFQ / guide submissions.
// Saves each lead to KV (binding: LEADS) and emails it via Resend (RESEND_API_KEY).
// Returns { ok:true } if it stored or emailed; { ok:false } (503) if nothing is
// configured yet, so the front-end can fall back to a mailto: link.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
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

  let stored = false, emailed = false, emailErr = null;

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

  if (stored || emailed) return json({ ok: true, stored: stored, emailed: emailed, emailErr: emailErr });
  // Nothing configured yet → tell the client to use the mailto fallback.
  return json({ ok: false, error: "unconfigured" }, 503);
}

// Reject non-POST.
export async function onRequest(context) {
  if (context.request.method === "POST") return onRequestPost(context);
  return json({ ok: false, error: "method_not_allowed" }, 405);
}
