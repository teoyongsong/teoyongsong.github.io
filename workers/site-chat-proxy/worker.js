/**
 * Phase 1: Multi-agent + multi-tool orchestrator for site chat.
 *
 * Route: POST /
 * Body:  { messages: [{ role, content }...], model?: string, debug?: boolean }
 * Reply: { content: string, model?: string, trace: { intent, agents, tools } }
 *
 * Optional LLM synthesis (recommended):
 *   OPENAI_API_KEY, OPENAI_BASE_URL, CHAT_MODEL
 *
 * If no key is configured, deterministic synthesis is used.
 */

const SITE_DATA = {
  owner: "Danny Teo Yong Song",
  domain: "teoyongsong.github.io",
  summary:
    "Consultant and builder focused on AI/ML, data, security, and rapid prototype delivery in 3-day sprints.",
  projects: [
    {
      slug: "rag-studio",
      name: "RAG Studio (Private-by-Default)",
      tags: ["rag", "llm", "privacy", "documents"],
      impact: "Private document Q&A without sending sensitive data to the cloud.",
      link: "projects/rag-studio.html",
    },
    {
      slug: "hdb-price-predictor",
      name: "HDB Resale Price Predictor",
      tags: ["ml", "tabular", "singapore", "housing"],
      impact: "Evidence-backed resale discussions using public data.",
      link: "projects/hdb-price-predictor.html",
    },
    {
      slug: "cnn-waste",
      name: "CNN Waste Classification",
      tags: ["computer vision", "cnn", "recycling"],
      impact: "Visual sorting and education for recycling workflows.",
      link: "projects/cnn-waste.html",
    },
    {
      slug: "once-upon-storytelling",
      name: "Once Upon App (Storytelling MVP)",
      tags: ["product", "storytelling", "family"],
      impact: "Age-aware personalized stories for family engagement.",
      link: "projects/once-upon-storytelling.html",
    },
  ],
  blog: [
    {
      slug: "how-i-built-my-personal-website-with-github-pages",
      title: "How I Built My Personal Website with GitHub Pages",
      topic: "website building",
      date: "2026-04-17",
      link: "blog/how-i-built-my-personal-website-with-github-pages.html",
    },
    {
      slug: "beginners-guide-to-machine-learning",
      title: "A Beginner's Guide to Machine Learning",
      topic: "machine learning",
      date: "2026-03-31",
      link: "blog/beginners-guide-to-machine-learning.html",
    },
    {
      slug: "from-data-to-business-impact",
      title: "From Data to Business Impact",
      topic: "data strategy",
      date: "2026-03-28",
      link: "blog/from-data-to-business-impact.html",
    },
  ],
  contact: {
    whatsapp: "+65 9685 2990",
    email: "teo_yongsong@yahoo.com.sg",
    github: "https://github.com/teoyongsong",
    linkedin: "https://www.linkedin.com/in/teoyongsong/",
    consulting: "https://dannyteo.github.io/",
  },
};

export default {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request, env);
    if (corsHeaders.errorResponse) return corsHeaders.errorResponse;

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders.headers });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, corsHeaders.headers);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400, corsHeaders.headers);
    }

    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: "Expected { messages: OpenAI-style message array }" }, 400, corsHeaders.headers);
    }

    const userMessage = [...messages].reverse().find((m) => m && m.role === "user" && typeof m.content === "string")?.content?.trim();
    if (!userMessage) {
      return json({ error: "No user message found in messages[]" }, 400, corsHeaders.headers);
    }

    const plan = orchestrate(userMessage);
    const agentOutputs = runAgents(plan, userMessage);
    const synthesisPayload = buildSynthesisPayload(userMessage, plan, agentOutputs);

    let content;
    let modelUsed = null;
    try {
      const llm = await synthesizeWithLLM(synthesisPayload, body.model, env);
      content = llm.content;
      modelUsed = llm.model;
    } catch {
      content = synthesizeDeterministic(synthesisPayload);
    }

    const trace = {
      intent: plan.intent,
      agents: plan.agents,
      tools: plan.tools,
    };

    return json({ content, model: modelUsed, trace }, 200, corsHeaders.headers);
  },
};

function getCorsHeaders(request, env) {
  const raw = env.ALLOWED_ORIGIN || "*";
  const origin = request.headers.get("Origin") || "";
  let corsOrigin = "*";
  if (raw !== "*") {
    const allowed = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (origin && allowed.includes(origin)) corsOrigin = origin;
    else if (!origin && allowed.length) corsOrigin = allowed[0];
    else if (origin && !allowed.includes(origin)) {
      return {
        errorResponse: new Response(JSON.stringify({ error: "Origin not allowed" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }),
      };
    }
  }
  return {
    headers: {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  };
}

function orchestrate(query) {
  const q = query.toLowerCase();
  const offTopic = /(weather|bitcoin|stock|recipe|movie|politics|sports|homework|debug my code)/i.test(q);
  if (offTopic) {
    return { intent: "offtopic", agents: ["scopeGuardAgent"], tools: ["scope_check"] };
  }

  if (/(hire|work with|consult|consulting|contact|email|whatsapp|book)/i.test(q)) {
    return { intent: "lead", agents: ["leadQualifierAgent", "siteQaAgent"], tools: ["get_contact_options", "search_site_content"] };
  }
  if (/(blog|post|article|insight|write)/i.test(q)) {
    return { intent: "blog", agents: ["blogInsightAgent", "siteQaAgent"], tools: ["get_blog_posts", "search_site_content"] };
  }
  if (/(recommend|which project|where start|show project|projects|portfolio|rag|hdb|cnn|story)/i.test(q)) {
    return { intent: "projects", agents: ["projectRecommenderAgent", "siteQaAgent"], tools: ["get_project_details", "search_site_content"] };
  }
  return { intent: "qa", agents: ["siteQaAgent"], tools: ["search_site_content"] };
}

function runAgents(plan, query) {
  const outputs = [];
  for (const agent of plan.agents) {
    if (agent === "scopeGuardAgent") outputs.push(scopeGuardAgent(query));
    if (agent === "siteQaAgent") outputs.push(siteQaAgent(query));
    if (agent === "projectRecommenderAgent") outputs.push(projectRecommenderAgent(query));
    if (agent === "blogInsightAgent") outputs.push(blogInsightAgent(query));
    if (agent === "leadQualifierAgent") outputs.push(leadQualifierAgent(query));
  }
  return outputs;
}

function buildSynthesisPayload(query, plan, outputs) {
  const toolData = {
    search_site_content: searchSiteContent(query),
    get_project_details: getProjectDetails(query),
    get_blog_posts: getBlogPosts(),
    get_contact_options: getContactOptions(),
  };
  return { query, plan, outputs, toolData };
}

async function synthesizeWithLLM(payload, requestedModel, env) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("No OPENAI_API_KEY");

  const baseUrl = (env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = requestedModel || env.CHAT_MODEL || "gpt-4o-mini";
  const sys =
    "You are a portfolio assistant. Only answer about teoyongsong.github.io and related consulting/contact info. " +
    "If off-topic, politely refuse. Keep answers concise and helpful. Do not invent facts.";
  const usr = [
    "User question:",
    payload.query,
    "",
    "Intent:",
    payload.plan.intent,
    "",
    "Agent outputs:",
    JSON.stringify(payload.outputs),
    "",
    "Tool results:",
    JSON.stringify(payload.toolData),
  ].join("\n");

  const upstream = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: usr },
      ],
      temperature: 0.4,
      max_tokens: 500,
    }),
  });
  const data = await upstream.json();
  if (!upstream.ok) throw new Error(data?.error?.message || "LLM upstream error");
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("No content from LLM");
  return { content, model: data.model || model };
}

function synthesizeDeterministic(payload) {
  const { plan, outputs } = payload;
  if (plan.intent === "offtopic") return outputs[0]?.message || "I can only answer questions about this website.";
  const lines = [];
  for (const out of outputs) {
    if (!out || !out.message) continue;
    lines.push(out.message);
  }
  return lines.join("\n\n");
}

// ------------------ Agents ------------------
function scopeGuardAgent() {
  return {
    agent: "scopeGuardAgent",
    message:
      "I'm sorry, but I can only answer questions about this website (teoyongsong.github.io), Danny's projects, blog, capabilities, and how to collaborate. Please ask something related to the site.",
  };
}

function siteQaAgent(query) {
  const hits = searchSiteContent(query);
  if (!hits.length) {
    return {
      agent: "siteQaAgent",
      message:
        "This site presents Danny Teo Yong Song's AI/ML portfolio, featured projects, blog insights, and contact/consulting paths. Tell me which section you want: projects, blog, capabilities, or contact.",
    };
  }
  const bullets = hits.slice(0, 3).map((h) => `- ${h.title}: ${h.summary}`);
  return { agent: "siteQaAgent", message: `Here are the most relevant site details:\n${bullets.join("\n")}` };
}

function projectRecommenderAgent(query) {
  const projects = getProjectDetails(query);
  if (!projects.length) {
    return {
      agent: "projectRecommenderAgent",
      message:
        "Recommended starting points: RAG Studio (privacy-first document Q&A), HDB Price Predictor (tabular ML), CNN Waste Classification (computer vision), and Once Upon App (storytelling MVP).",
    };
  }
  const bullets = projects.map((p) => `- ${p.name}: ${p.impact} (${p.link})`);
  return { agent: "projectRecommenderAgent", message: `Projects that best match your question:\n${bullets.join("\n")}` };
}

function blogInsightAgent(query) {
  const posts = getBlogPosts(query);
  const bullets = posts.slice(0, 3).map((p) => `- ${p.title} (${p.topic}) — ${p.link}`);
  return { agent: "blogInsightAgent", message: `Relevant blog content:\n${bullets.join("\n")}` };
}

function leadQualifierAgent() {
  const c = getContactOptions();
  return {
    agent: "leadQualifierAgent",
    message:
      `For collaboration, the fastest paths are WhatsApp ${c.whatsapp} or email ${c.email}. ` +
      `For formal consulting/speaking, use ${c.consulting}. ` +
      "If you share your goal and timeline, Danny can suggest a suitable 3-day sprint scope.",
  };
}

// ------------------ Tools ------------------
function searchSiteContent(query) {
  const q = query.toLowerCase();
  const sections = [
    {
      title: "About & Positioning",
      summary: SITE_DATA.summary,
      keywords: ["about", "who", "danny", "positioning", "capabilities"],
    },
    {
      title: "Featured Projects",
      summary: "RAG Studio, HDB predictor, CNN waste classification, Once Upon App.",
      keywords: ["project", "portfolio", "rag", "hdb", "cnn", "story"],
    },
    {
      title: "Blog & Insights",
      summary: "Practical articles on website building, ML fundamentals, and business impact from data.",
      keywords: ["blog", "post", "article", "insight", "write"],
    },
    {
      title: "Contact & Consulting",
      summary: "WhatsApp, email, GitHub, LinkedIn, and consulting site link.",
      keywords: ["contact", "email", "whatsapp", "consult", "hire"],
    },
  ];
  return sections.filter((s) => s.keywords.some((k) => q.includes(k)));
}

function getProjectDetails(query) {
  const q = query.toLowerCase();
  const matched = SITE_DATA.projects.filter(
    (p) => q.includes(p.slug) || q.includes(p.name.toLowerCase()) || p.tags.some((t) => q.includes(t))
  );
  return matched.length ? matched : SITE_DATA.projects.slice(0, 4);
}

function getBlogPosts(query = "") {
  const q = query.toLowerCase();
  const matched = SITE_DATA.blog.filter((p) => q.includes(p.slug) || q.includes(p.topic) || q.includes(p.title.toLowerCase()));
  return matched.length ? matched : SITE_DATA.blog;
}

function getContactOptions() {
  return SITE_DATA.contact;
}

function json(obj, status, extraHeaders) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}
