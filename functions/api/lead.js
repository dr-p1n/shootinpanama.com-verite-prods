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

// Timestamp in Panama local time. America/Panama is a fixed UTC-5 (no daylight saving),
// so a straight -5h shift is always correct. Format: "2026-07-17 22:19:16 -05:00".
function panamaTs(d) {
  const local = new Date(d.getTime() - 5 * 60 * 60 * 1000);
  return local.toISOString().slice(0, 19).replace("T", " ") + " -05:00";
}

function firstName(l) {
  return (l.name || "").split(" ")[0] || l.name || "";
}

// One-tap reply: a mailto: composed straight to the enquirer, so answering never depends on the
// client honouring Reply-To (the From address has no inbox). Subject + a short greeting are
// prefilled; long bodies get truncated by some clients, so keep it to the salutation.
function replyMailto(l) {
  const subject = "Re: your " + (l.kind === "guide" ? "guide request" : "production enquiry") +
    " — Shoot In Panama";
  const body = "Hi " + (firstName(l) || "there") + ",\n\n";
  // The address must stay literal in the mailto path — Gmail web's handler does NOT
  // percent-decode the recipient, so an encoded "@" (%40) or "+" (%2B) makes it drop the
  // To field. Encode any genuinely unsafe chars but restore @ and + so real clients fill To.
  const addr = encodeURIComponent(l.email).replace(/%40/g, "@").replace(/%2B/g, "+");
  return "mailto:" + addr +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body);
}

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
    "Reply to " + (l.name || l.email) + ": " + l.email,
    "",
  ].concat(list).concat([
    "",
    sheetUrl ? "All leads (Google Sheet): " + sheetUrl : null,
    "Hitting Reply on this message also goes to " + l.email + ".",
    "— sent " + l.ts + (l.ip ? " · " + l.ip : ""),
  ]).filter(function (x) { return x !== null; }).join("\n");
}

// Escape user-supplied text before it goes into the HTML email.
function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Branded HTML notification — near-black header with the official badge, burnt-orange
// accent, numbered fields, brief callout, and a button to the leads Google Sheet.
// Colors mirror the site: --ink #03060a, --paper #EEECEA, --accent #C9541E.
// Web fonts don't load in email, so Georgia stands in for Fraunces on the name.
// Sent alongside the plain-text version (renderText) as a robust fallback.
function renderHtml(l, sheetUrl) {
  const isGuide = l.kind === "guide";
  const eyebrow = isGuide ? "New guide request" : "New production enquiry";
  const logo = "https://www.shootinginpanama.com/assets/logo-badge-256.png";

  // Numbered rows — name/company sit in the header, brief gets its own callout.
  const rows = [
    ["Email", l.email],
    ["Production type", l.type],
    ["Crew size", l.crew],
    ["Estimated dates", l.dates],
    ["Guide", l.guide],
    ["Site language", l.lang],
  ].filter(function (f) { return f[1]; });

  const rowsHtml = rows.map(function (f, i) {
    const val = f[0] === "Email"
      ? '<a href="mailto:' + esc(l.email) + '" style="color:#03060a;text-decoration:none">' + esc(l.email) + "</a>"
      : esc(f[1]);
    return '<tr>' +
      '<td style="padding:9px 0;border-bottom:1px solid #ddd9d4;width:26px;color:#C9541E;font-weight:bold;vertical-align:top">' + (i + 1) + '</td>' +
      '<td style="padding:9px 0;border-bottom:1px solid #ddd9d4;color:#8a877f;width:120px">' + esc(f[0]) + '</td>' +
      '<td style="padding:9px 0;border-bottom:1px solid #ddd9d4;color:#03060a">' + val + '</td>' +
      '</tr>';
  }).join("");

  const companyHtml = l.company
    ? '<div style="color:#6a6862;font-size:14px;margin-top:2px">' + esc(l.company) + '</div>' : "";

  const briefHtml = l.brief
    ? '<div style="padding:14px 28px 0"><div style="color:#8a877f;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">Brief</div>' +
      '<div style="background:#ffffff;border-left:3px solid #C9541E;padding:12px 14px;font-size:14px;line-height:1.55;color:#2a2824">' + esc(l.brief) + '</div></div>' : "";

  // Primary action: compose straight to the enquirer. Secondary: the Sheet, in outline style,
  // so there is only ever one obvious thing to click.
  const replyHtml =
    '<div style="padding:20px 28px 0">' +
      '<a href="' + esc(replyMailto(l)) + '" style="display:inline-block;background:#C9541E;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;padding:13px 24px;border-radius:4px">Reply to ' + esc(firstName(l) || l.email) + ' &rarr;</a>' +
      '<div style="color:#6a6862;font-size:13px;line-height:1.5;margin-top:10px">Opens a new message to ' +
        '<a href="mailto:' + esc(l.email) + '" style="color:#03060a">' + esc(l.email) + '</a>. Hitting Reply on this notification goes to the same place.</div>' +
    '</div>';

  const ctaHtml = sheetUrl
    ? '<a href="' + esc(sheetUrl) + '" style="display:inline-block;background:transparent;color:#03060a;text-decoration:none;font-size:13px;font-weight:bold;padding:10px 18px;border:1px solid #b9b5b0;border-radius:4px">Open all leads in Google Sheet &rarr;</a>' : "";

  return '<!doctype html><html><body style="margin:0;padding:0;background:#e4e1de">' +
    '<div style="background:#e4e1de;padding:20px 12px">' +
    '<div style="max-width:600px;margin:0 auto;background:#EEECEA;border-radius:6px;overflow:hidden;font-family:Helvetica,Arial,sans-serif;border:1px solid #c9c6c2">' +
      '<div style="background:#03060a;padding:20px 28px">' +
        '<table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>' +
          '<td style="vertical-align:middle"><img src="' + logo + '" width="38" height="38" alt="Shoot In Panama" style="display:block;border-radius:4px"></td>' +
          '<td style="vertical-align:middle;text-align:right;color:#8a8f96;font-size:11px;letter-spacing:1.5px">SHOOT IN PANAMA<br><span style="color:#5f636a">Verite Producciones</span></td>' +
        '</tr></table>' +
      '</div>' +
      '<div style="height:3px;background:#C9541E"></div>' +
      '<div style="padding:28px 28px 8px">' +
        '<div style="color:#C9541E;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">' + eyebrow + '</div>' +
        '<div style="font-family:Georgia,\'Times New Roman\',serif;font-size:24px;color:#03060a;margin-top:6px;line-height:1.15">' + esc(l.name || l.email) + '</div>' +
        companyHtml +
      '</div>' +
      replyHtml +
      '<div style="padding:16px 28px 4px"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:14px;color:#03060a">' + rowsHtml + '</table></div>' +
      briefHtml +
      '<div style="padding:22px 28px 6px">' + ctaHtml + '</div>' +
      '<div style="border-top:1px solid #ddd9d4;margin-top:16px;padding:14px 28px;color:#9a978f;font-size:11px;line-height:1.5">Sent ' + esc(l.ts) + (l.ip ? " &middot; " + esc(l.ip) : "") + '<br>shootinginpanama.com &mdash; automated lead notification</div>' +
    '</div></div></body></html>';
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
    ts: panamaTs(new Date()),
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

  // 2) Forward to the Verite Worker: it saves the lead in D1 (the admin shows it under Shoot in Panama) and writes
  //    the row in the Sheet tab "Shoot in Panama". KV already holds the lead, so a failure here loses
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
          html: renderHtml(lead, sheetUrl),
          text: renderText(lead, sheetUrl),
        }),
      });
      emailed = res.ok;
      if (!res.ok) emailErr = "resend_" + res.status;
    } catch (e) { emailErr = "resend_exception"; }
  }

  // 4) Legacy Google Sheet backup, only if SHEET_ENDPOINT is set: append to the previous
  //    Google Sheet (Apps Script Web App). Superseded by the forward above, which writes the
  //    Sheet tab "Shoot in Panama" — kept last so a slow Apps Script cannot hold up the
  //    notification, and server-to-server, so no CSP/CORS concerns.
  if (env.SHEET_ENDPOINT) {
    try {
      const res = await fetch(env.SHEET_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(8000),
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
