# Drive Bot ✻

A minimal, Claude-style chat interface that fetches files from your Google Drive.
You type what you need ("TP 3 cybersécurité"), an [n8n](https://n8n.io) workflow asks Gemini to pick the right file from your Drive, and the file comes back into the chat with a live preview.

One page. No auth. No database. Chats are stored in your browser.

## Features

- **Claude-style UI**: clean chat layout, typing indicator, suggestion chips
- **Light / dark mode** toggle (follows your system theme on first visit, then remembers your choice)
- **File preview panel**: PDFs, images and HTML render in a side panel; other formats get a download screen
- **Clarify buttons**: when several files match, the bot shows clickable options
- **Chat history in the browser**: sidebar with recents, delete, and per-chat memory (text in `localStorage`, files in IndexedDB)
- **Deploys to Cloudflare Workers** with a GitHub Actions pipeline on every push to `main`

## How it works

```
Browser (Next.js UI)
   │  POST /api/chat  { prompt, channel_id }
   ▼
Next.js route handler  ── hides the n8n URL, streams the response back
   │  POST N8N_WEBHOOK_URL
   ▼
n8n workflow
   Webhook → Gemini agent (picks file from the Drive tree) → Switch
      ├─ found     → Drive search → Drive download → base64 JSON → Respond to Webhook
      ├─ clarify   → Respond to Webhook (options list)
      └─ not_found → Respond to Webhook (message)
```

`channel_id` is the chat id. n8n uses it as the memory session key, so each chat has its own conversation context.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Plain CSS with CSS variables for theming (no UI library)
- [n8n](https://n8n.io) + Google Gemini + Google Drive for the backend
- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare) + [Wrangler](https://developers.cloudflare.com/workers/wrangler/) for hosting
- GitHub Actions for CI/CD

## Project structure

```
.
├── app/
│   ├── api/chat/route.ts     # proxy to the n8n webhook
│   ├── chat.css              # all styling + light/dark themes
│   ├── layout.tsx            # sets the theme before first paint
│   └── page.tsx              # the whole chat UI
├── .github/workflows/
│   └── deploy.yml            # CI/CD to Cloudflare Workers
├── next.config.ts
├── open-next.config.ts       # OpenNext adapter config
├── wrangler.jsonc            # Cloudflare Worker config
└── package.json
```

## Prerequisites

- Node.js 20 or newer
- An n8n instance with the Drive Bot workflow imported and **active**
- A Cloudflare account (only for deployment)

## Local setup

```bash
git clone <your-repo-url>
cd <your-repo>
npm install
```

Create `.env.local` with your n8n **production** webhook URL:

```
N8N_WEBHOOK_URL=https://YOUR-N8N-HOST/webhook/<your-webhook-path>
```

Run it:

```bash
npm run dev
```

Open http://localhost:3000.

## n8n webhook contract

**Request** (sent by the route handler):

```json
{ "prompt": "TP 3 cybersécurité", "channel_id": "<chat id>" }
```

**Responses** (JSON, one of three shapes):

```json
{ "type": "text", "message": "..." }
```

```json
{ "type": "clarify", "message": "...", "options": [{ "fileId": "...", "fileName": "TP-3.pdf" }] }
```

```json
{ "type": "file", "message": "...", "fileName": "TP-3.pdf", "mimeType": "application/pdf", "base64": "..." }
```

In the workflow, the Webhook node must be set to **Respond: Using "Respond to Webhook" Node**.

## Configuration

| Variable | Where | Description |
| --- | --- | --- |
| `N8N_WEBHOOK_URL` | `.env.local` (local), Worker secret (production) | n8n production webhook URL |
| `CLOUDFLARE_API_TOKEN` | GitHub Actions secret | Token with the "Edit Cloudflare Workers" permission |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions secret | Your Cloudflare account ID |

## Deploy to Cloudflare Workers

One-time setup:

```bash
npm i @opennextjs/cloudflare@latest
npm i -D wrangler@latest
npx wrangler login
npm run deploy
npx wrangler secret put N8N_WEBHOOK_URL
```

Useful scripts:

| Script | What it does |
| --- | --- |
| `npm run preview` | Build and run the app locally in the Workers runtime |
| `npm run deploy` | Build and deploy to Cloudflare |
| `npm run upload` | Upload a new version without promoting it |

## CI/CD

`.github/workflows/deploy.yml` runs on every push and pull request to `main`:

1. Installs dependencies with `npm ci`
2. Builds the app with OpenNext (so broken builds fail on pull requests too)
3. On pushes to `main` only, deploys to Cloudflare Workers

Add these two repository secrets under **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The `N8N_WEBHOOK_URL` secret lives on the Worker itself and survives deploys.

## Storage and privacy

- Chat text is stored in `localStorage` (`drivebot:chats`)
- Downloaded files are stored in IndexedDB (database `drivebot`)
- Theme preference is stored in `localStorage` (`theme`)
- Nothing is sent to any server except the prompt and chat id, which go to your own n8n instance
- Clearing site data in the browser wipes all chats and files

## Limits and notes

- **File size:** the Worker has 128 MB of memory per isolate, so the route handler streams n8n's response through without parsing it. Files are returned as base64 inside JSON, which is about 33% bigger than the original, so very large files are better delivered through a signed Drive link instead.
- **Previews:** browsers can render PDFs, images and HTML. `.pptx`, `.xlsx` and `.docx` show a download screen. iOS Safari often shows only the first page of an embedded PDF, so use "Open in new tab" there.
- **Bot memory:** the n8n Simple Memory node keeps context in RAM by default, so it resets when n8n restarts.
- **Public repos:** the n8n workflow export contains your Drive file tree and email address. Remove them before committing it to a public repository.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Chat always says "Couldn't reach the workflow" | The workflow is inactive, or `N8N_WEBHOOK_URL` still points at the `/webhook-test/` URL |
| n8n returns "Workflow started" | Set the Webhook node to respond with the Respond to Webhook node |
| Deploy works but the bot can't reach n8n | Run `npx wrangler secret put N8N_WEBHOOK_URL` (`.env.local` is not deployed) |
| `.open-next/worker.js` not found | Build with `npx opennextjs-cloudflare build`, not plain `next build` |
| GitHub Action fails with an authentication error | Check the two Cloudflare secrets and the token's Workers permission |

## License

MIT