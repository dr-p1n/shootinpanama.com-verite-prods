// GET /api/leads?token=... — token-protected read-back of stored leads (KV backup).
// Set LEADS_TOKEN as a Pages secret. Without it, or with a wrong token, returns 401.

function json(obj, status) {
  return new Response(JSON.stringify(obj, null, 2), {
    status: status || 200,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || request.headers.get("x-leads-token") || "";

  if (!env.LEADS_TOKEN || token !== env.LEADS_TOKEN) return json({ ok: false, error: "unauthorized" }, 401);
  if (!env.LEADS) return json({ ok: false, error: "no_store" }, 503);

  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100", 10) || 100, 1000);
  const list = await env.LEADS.list({ prefix: "lead:", limit: limit });
  const items = [];
  for (const k of list.keys) {
    const v = await env.LEADS.get(k.name);
    if (v) { try { items.push(JSON.parse(v)); } catch (e) {} }
  }
  items.sort(function (a, b) { return (b.ts || "").localeCompare(a.ts || ""); });
  return json({ ok: true, count: items.length, leads: items });
}
