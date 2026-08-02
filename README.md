# DataGraph

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8)](https://tailwindcss.com/)

AI-powered data visualization tool by **RanBOT Labs**. Upload a CSV or Excel file, chat with Claude, ChatGPT or Gemini, and get interactive charts generated on the fly.

**Live demo:** [data-graph.ranbot.online](https://data-graph.ranbot.online/)

## Features

- **Drag-and-drop ingestion** for `.csv`, `.xlsx`, and `.xls` files with automatic column-type inference (string / number / date).
- **Multi-provider AI chat** supporting Anthropic Claude, OpenAI (ChatGPT) and Google Gemini — bring your own API key.
- **Interactive charts** via Recharts: line, bar, pie, area, scatter, and raw table views with sum/avg/count aggregation and filters.
- **Browser-only persistence** — parsed data, graphs, chat history and settings live in IndexedDB (via Zustand `persist`). Nothing is stored on the server.
- **Internationalization** — English, Japanese (日本語) and Chinese (中文) UI.
- **Light / dark theme** powered by `next-themes`.

## Tech Stack

| Layer | Tool |
| ---- | ---- |
| Framework | Next.js 14 (App Router, standalone output) |
| UI | React 18, Tailwind CSS 3, Recharts 3 |
| State | Zustand 5 with IndexedDB-backed persistence |
| AI SDKs | `@anthropic-ai/sdk`, `openai`, `@google/generative-ai` |
| File parsing | PapaParse (CSV), SheetJS `xlsx` (Excel) |
| Testing | Jest 30, Testing Library, `jest-environment-jsdom` |

## Requirements

- Node.js 18.17+ (Next.js 14 requirement)
- npm / yarn / pnpm / bun
- At least one API key from: Anthropic, OpenAI, or Google AI Studio

## Installation

```bash
git clone git@github.com:ranbot-ai/data-graph.git
cd graph-tool
npm install
```

## Configuration

API keys can be provided two ways:

### 1. Environment variables (recommended for deployment)

Create `.env.local` in the project root:

```bash
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
```

The `/api/chat` route prefers env keys when present.

### 2. In-app Settings page (local dev / static hosting)

Visit `/settings` and paste keys for each provider. Keys are stored in the browser's IndexedDB only and sent on the `x-api-key` header when calling `/api/chat`.

| Variable | Description | Required |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Claude API key | Optional* |
| `OPENAI_API_KEY` | OpenAI API key | Optional* |
| `GEMINI_API_KEY` | Google Generative AI key | Optional* |

\* At least one provider key must be available (env or in-browser) for chat to work.

## Usage

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and:

1. Drop a CSV/Excel file on the upload page.
2. On the dashboard, switch between **Table** and **Charts** tabs.
3. Ask the assistant things like:
   - *"Show cost by model as a bar chart"*
   - *"Plot daily revenue as a line chart"*
   - *"Pie chart of users by country"*
4. Generated graphs are added to the Charts tab and persisted across reloads.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build (`output: 'standalone'`) |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint via `next lint` |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Run Jest in watch mode |

## Project Structure

```
graph-tool/
├── app/
│   ├── api/chat/route.ts      # POST endpoint that proxies to AI providers
│   ├── dashboard/page.tsx     # Table + Charts + chat UI
│   ├── settings/page.tsx      # Provider + API key + preferences
│   ├── layout.tsx             # Root layout, fonts, Providers
│   └── page.tsx               # Upload landing page
├── components/                # ChatPanel, DataTable, GraphCard, FileUploader, ...
├── lib/
│   ├── aiProviders.ts         # buildSystemPrompt, parseAIResponse, callAI
│   ├── graphDataTransformer.ts# Aggregation + filter pipeline
│   ├── parsers.ts             # CSV / Excel parsing & type inference
│   ├── store.ts               # Zustand store (+ IndexedDB persist)
│   ├── idb.ts                 # IndexedDB storage adapter
│   ├── i18n.ts                # en / ja / zh translations
│   └── types.ts               # Shared TS types
├── __tests__/                 # Jest tests (api, components, lib)
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## API

### `POST /api/chat`

Proxies a natural-language request to the selected AI provider and returns a `GraphConfig`-shaped JSON response.

**Request**

```json
{
  "provider": "claude" | "openai" | "gemini",
  "message": "Show cost by model as a bar chart",
  "columns": [{ "name": "model", "type": "string" }],
  "sampleRows": [{ "model": "gpt-4o", "cost": 1.23 }]
}
```

Headers: `x-api-key` (fallback when env var is missing).

**Response**

```json
{
  "type": "bar",
  "title": "Cost by model",
  "xAxis": "model",
  "yAxis": "cost",
  "aggregation": "sum",
  "valueFormat": "currency",
  "filters": [],
  "message": "Total cost per model"
}
```

Errors return `{ "error": "..." }` with status 400 or 500.

## Testing

```bash
npm test
```

Suites cover:

- `lib/parsers` — CSV/Excel parsing and type inference
- `lib/aiProviders` — system-prompt builder and response parser
- `lib/graphDataTransformer` — aggregation, filtering, date-key normalization
- API route handler (`/api/chat`)
- Key components (ChatPanel, ChatMessage, DataTable, FileUploader, GraphCard, ProviderSelector)

## Deployment

The `next.config.mjs` uses `output: 'standalone'` for a small, self-contained server bundle. Deploy to Vercel, Docker, or any Node host.

### Build & run

```bash
npm install
npm run build
cp -r .next/static .next/standalone/.next/static   # static assets aren't copied automatically
[ -d public ] && cp -r public .next/standalone/public
node .next/standalone/server.js
```

If your fork adds a `public/` directory, copy that too (`cp -r public .next/standalone/public`) — this repo has none, since its only static asset (`favicon.ico`) lives under `app/` and is served natively by the App Router.

Set the provider env vars (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`) and optionally `PORT` before starting.

### Process manager (pm2)

On a Linux VM, run the standalone server under [pm2](https://pm2.keymetrics.io/) so it restarts on crash/reboot:

```bash
pm2 start server.js --name data-graph
pm2 save                       # persist the process list
pm2 startup systemd            # (one-time) resurrect pm2 on server reboot
```

Check what's actually in `.next`:

```bash
ls -la .next                # should contain: standalone/  static/  server/  ...
ls -la .next/standalone      # should contain: server.js  node_modules/  package.json  .next/
find . -maxdepth 3 -iname "server.js"
```

Common operations:

```bash
pm2 status data-graph                    # is it running?
pm2 logs data-graph --lines 50           # tail logs
pm2 restart data-graph                   # after a rebuild/deploy
```

The path to `server.js` depends on where the build ran: if you `npm run build` in place (as above), it's `.next/standalone/server.js` relative to the project root. If you instead sync a build output into a separate deploy directory (e.g. rsyncing the *contents* of `.next/standalone/` into it), `server.js` ends up at the top level of that directory instead — run `find . -maxdepth 2 -iname server.js` if `pm2 start` reports `Script not found`.

### Hosting options

- **Vercel** — zero config; `output: 'standalone'` is ignored safely since Vercel uses its own build pipeline.
- **Docker** — multi-stage build copying `.next/standalone`, `.next/static`, and `public` (if present) into a slim runtime image.
- **Any Linux VM** (e.g. Ubuntu) — pm2 (above) plus `nginx` in front as a reverse proxy handling TLS.

## Privacy

- Uploaded files are parsed **entirely in the browser**; only column metadata and up to 10 sample rows are sent with each chat request to help the model pick axes.
- API keys entered via Settings never leave the browser except on the `x-api-key` header of same-origin calls to `/api/chat`.
- Graphs, messages and settings persist in the browser's IndexedDB (`datagraph` database).

## License

MIT © RanBOT Labs.
