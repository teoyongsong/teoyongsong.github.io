/**
 * Cloudflare Worker: proxy for portfolio site chat (OpenAI-compatible API).
 *
 * Secrets (Wrangler / dashboard):
 *   OPENAI_API_KEY   — required
 * Optional:
 *   OPENAI_BASE_URL  — default https://api.openai.com/v1
 *   CHAT_MODEL       — default gpt-4o-mini
 *   ALLOWED_ORIGIN   — comma-separated origins; default * (tighten in production)
 */
export default {
  async fetch(request, env) {
    const raw = env.ALLOWED_ORIGIN || "*";
    const origin = request.headers.get("Origin") || "";
    let corsOrigin = "*";
    if (raw !== "*") {
      const allowed = raw.split(",").map((s) => s.trim()).filter(Boolean);
      if (origin && allowed.includes(origin)) corsOrigin = origin;
      else if (!origin && allowed.length) corsOrigin = allowed[0];
      else if (origin && !allowed.includes(origin)) {
        return new Response(JSON.stringify({ error: "Origin not allowed" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, corsHeaders);
    }

    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return json({ error: "Worker is missing OPENAI_API_KEY" }, 500, corsHeaders);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400, corsHeaders);
    }

    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: "Expected { messages: OpenAI-style message array }" }, 400, corsHeaders);
    }

    const baseUrl = (env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
    const model = body.model || env.CHAT_MODEL || "gpt-4o-mini";

    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.5,
        max_tokens: 900,
      }),
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return json(
        { error: "Upstream returned non-JSON", status: upstream.status, raw: text.slice(0, 500) },
        502,
        corsHeaders
      );
    }

    if (!upstream.ok) {
      return json(
        { error: data.error?.message || data.error || "Upstream error", status: upstream.status },
        502,
        corsHeaders
      );
    }

    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return json({ error: "No assistant message in response" }, 502, corsHeaders);
    }

    return json({ content, model: data.model || model }, 200, corsHeaders);
  },
};

function json(obj, status, extraHeaders) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}
