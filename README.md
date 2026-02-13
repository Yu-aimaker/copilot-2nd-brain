# 🧠 2nd Brain

An intelligent knowledge logging and thought-extension app. AI reads your SOURCEs, converts them to knowledge, and suggests concrete next actions — building your personal intellectual foundation.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native, Expo SDK 54, Expo Router 6 |
| Styling | NativeWind 4 (Tailwind CSS for RN) |
| Language | TypeScript 5.x |
| Data Fetching | TanStack Query + tRPC |
| Backend | Express, tRPC |
| Database | MySQL via Drizzle ORM |
| AI Integration | Pluggable LLM service (OpenAI / Anthropic) |
| External Access | MCP (Model Context Protocol) server |

## Architecture

```
copilot-2nd-brain/
├── apps/
│   ├── mobile/              # Expo React Native app
│   │   ├── app/             # Expo Router file-based routing
│   │   │   ├── (tabs)/      # Tab navigator
│   │   │   │   ├── index    # HOME – source feed & stats
│   │   │   │   ├── record   # RECORD – calendar view
│   │   │   │   └── next     # NEXT – AI action suggestions
│   │   │   └── source/[id]  # Source detail view
│   │   ├── components/      # Reusable UI components
│   │   └── lib/             # tRPC client, theme, providers
│   ├── server/              # Express + tRPC API
│   │   └── src/
│   │       ├── db/          # Drizzle schema & connection
│   │       ├── router/      # tRPC routers (source, action, report)
│   │       └── services/    # AI processing pipeline
│   └── mcp-server/          # MCP server for external AI access
│       └── src/
├── packages/
│   └── shared/              # Shared TypeScript types
└── package.json             # Workspace root
```

## Features

### 1. Three Tabs
- **HOME** – Knowledge feed showing recent sources with AI-generated summaries, tags, and priority indicators
- **RECORD** – Calendar view displaying sources by date with activity markers
- **NEXT** – AI-suggested concrete actions based on cross-analysis of accumulated knowledge

### 2. SOURCE Processing
- Supports all media types: text, URL, image, audio, video, PDF, file
- Auto-detection of source type on save
- AI pipeline automatically generates: summary, tags, priority, and project assignment

### 3. AI Processing Pipeline
- **On-save processing**: Every new source is automatically analyzed
- **Report generation**: Daily, weekly, and monthly knowledge reports
- **Action suggestions**: Cross-referencing accumulated sources to propose next steps

### 4. MCP Integration
The MCP server exposes your knowledge base to external AI tools:
- **Resources**: `brain://sources/recent`, `brain://actions/pending`, `brain://reports/latest`
- **Tools**: `search_sources`, `get_thought_history`, `get_pending_actions`

### 5. UI/UX
- Clean white-based design with subtle borders and shadows
- Floating action button on every tab for instant source capture
- Priority color coding (red/yellow/green)
- Smooth modal for source input with type selector

## Database Schema

| Table | Description |
|-------|-------------|
| `sources` | Knowledge entries with AI metadata |
| `actions` | AI-suggested next actions |
| `projects` | Grouping/categorization |
| `reports` | Generated periodic reports |
| `source_action_links` | Many-to-many relation |

## Getting Started

### Prerequisites
- Node.js ≥ 20
- MySQL 8+
- Expo CLI

### Setup

```bash
# Install dependencies
npm install

# Configure database
cp apps/server/.env.example apps/server/.env
# Edit DATABASE_URL in .env

# Push schema to database
npm run db:push --workspace=apps/server

# Start the API server
npm run dev:server

# Start the mobile app
npm run dev:mobile

# Start the MCP server
npm run dev:mcp
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `mysql://root:password@localhost:3306/second_brain` | MySQL connection |
| `PORT` | `4000` | API server port |
| `EXPO_PUBLIC_API_URL` | `http://localhost:4000/trpc` | tRPC endpoint for mobile |

## MCP Server Configuration

Add to your AI tool's MCP config (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "2nd-brain": {
      "command": "npx",
      "args": ["tsx", "apps/mcp-server/src/index.ts"],
      "env": {
        "DATABASE_URL": "mysql://root:password@localhost:3306/second_brain"
      }
    }
  }
}
```

## License

MIT