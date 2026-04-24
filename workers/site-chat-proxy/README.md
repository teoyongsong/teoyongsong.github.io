# Site chat proxy (Cloudflare Worker)

GitHub Pages is static only, so **API keys must not live in the browser**. This Worker holds your key and runs a **Phase 1 multi-agent orchestrator**.

## Phase 1 architecture

- **Orchestrator agent**: routes each query by intent.
- **Specialist agents**:
  - `siteQaAgent`
  - `projectRecommenderAgent`
  - `blogInsightAgent`
  - `leadQualifierAgent`
  - `scopeGuardAgent` (off-topic refusal)
- **Tools**:
  - `search_site_content`
  - `get_project_details`
  - `get_blog_posts`
  - `get_contact_options`

## API contract

- **POST** JSON: `{ "messages": [ { "role": "system"|"user"|"assistant", "content": "..." } ], "model": "optional" }`
- **Response**: `{ "content": "assistant reply text", "model": "...", "trace": { "intent": "...", "agents": [], "tools": [] } }`
- **CORS** enabled for browser calls from your portfolio domain

If `OPENAI_API_KEY` is configured, the Worker uses the LLM for final synthesis. If not, it returns a deterministic stitched response from agent outputs.

## Deploy (Wrangler)

1. Install [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) and log in.
2. From this folder:

```bash
cd workers/site-chat-proxy
wrangler secret put OPENAI_API_KEY
# paste your key when prompted
```

3. Optional secrets:

```bash
wrangler secret put ALLOWED_ORIGIN   # e.g. https://teoyongsong.github.io
wrangler secret put CHAT_MODEL       # e.g. gpt-4o-mini
wrangler secret put OPENAI_BASE_URL  # e.g. https://api.groq.com/openai/v1 for Groq
```

4. Deploy:

```bash
wrangler deploy
```

Copy the Worker URL (e.g. `https://site-chat-proxy.your-account.workers.dev`).

## Connect the site

In `index.html` `<head>`, set the meta tag (uncomment and paste your Worker URL):

```html
<meta name="site-chat-api" content="https://YOUR-WORKER.workers.dev">
```

If this meta tag is **missing**, the chat widget uses the built-in keyword assistant only (no external API).

## Groq / other OpenAI-compatible hosts

Set `OPENAI_BASE_URL` to the provider’s OpenAI-compatible base (no trailing slash) and use the provider’s key as `OPENAI_API_KEY`. Set `CHAT_MODEL` to a model that host supports.

## Security notes

- Prefer `ALLOWED_ORIGIN=https://teoyongsong.github.io` (and `http://localhost:8000` for local testing) instead of `*`.
- The browser still sends user messages to the Worker; do not log full prompts in production if you care about privacy.
