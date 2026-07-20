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

// Plain-text notification: a numbered list of the submitted fields, plus the Sheet link.
// Plain text on purpose — antifragile across every mail client, nothing to render or break.
function renderText(l, sheetUrl) {
  const fields = [
    ["Name", l.name],
    ["Company", l.company],
    ["Email", l.email],
    ["Production type", l.type],
    ["Crew size", l.crew],
    ["Estimated dates", l.dates],
    ["Guide", l.guide],
    ["Site language", l.lang],
    ["Brief", l.brief],
  ].filter(function (f) { return f[1]; });

  const list = fields.map(function (f, i) { return (i + 1) + ". " + f[0] + ": " + f[1]; });

  return [
    "New " + (l.kind === "guide" ? "guide request" : "production enquiry") + " — shootinginpanama.com",
    "",
  ].concat(list).concat([
    "",
    sheetUrl ? "All leads (Google Sheet): " + sheetUrl : null,
    "Reply to this email to respond to " + (l.name || l.email) + " directly.",
    "— sent " + l.ts + (l.ip ? " · " + l.ip : ""),
  ]).filter(function (x) { return x !== null; }).join("\n");
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

  let stored = false, emailed = false, sheeted = false, emailErr = null;

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

  // 2) Append to the Google Sheet first, so the notification links to an up-to-date sheet.
  //    Server-to-server (Apps Script Web App /exec URL in SHEET_ENDPOINT) — no CSP/CORS concerns.
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

  // 3) Notify via Resend (only once the key is configured) — HTML template + text fallback,
  //    with a button to the leads Google Sheet (SHEET_VIEW_URL).
  if (env.RESEND_API_KEY) {
    try {
      const from = env.LEAD_FROM || "Shoot In Panama <noreplymarketing@shootinginpanama.com>";
      const to = env.LEAD_TO || "rbarria@veriteproducciones.net";
      const sheetUrl = env.SHEET_VIEW_URL || "";
      const subject = (lead.kind === "guide" ? "Guide request" : "Production enquiry") +
        " — " + (lead.company || lead.name || "shootinginpanama.com");
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" },
        body: JSON.stringify({
          from: from, to: [to], reply_to: lead.email, subject: subject,
          text: renderText(lead, sheetUrl),
        }),
      });
      emailed = res.ok;
      if (!res.ok) emailErr = "resend_" + res.status;
    } catch (e) { emailErr = "resend_exception"; }
  }

  if (stored || emailed || sheeted) return json({ ok: true, stored: stored, emailed: emailed, sheeted: sheeted, emailErr: emailErr });
  // Nothing configured yet → tell the client to use the mailto fallback.
  return json({ ok: false, error: "unconfigured" }, 503);
}

// Reject non-POST.
export async function onRequest(context) {
  if (context.request.method === "POST") return onRequestPost(context);
  return json({ ok: false, error: "method_not_allowed" }, 405);
}
