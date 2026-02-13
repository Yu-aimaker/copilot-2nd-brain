import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { db } from "./db";
import { sources, actions, reports } from "./schema";
import { desc, eq } from "drizzle-orm";

const server = new McpServer({
  name: "2nd-brain-mcp",
  version: "0.1.0",
});

// ─── Resources: expose accumulated knowledge ─────────────────

server.resource("sources-recent", "brain://sources/recent", async (uri) => ({
  contents: [
    {
      uri: uri.href,
      mimeType: "application/json",
      text: JSON.stringify(
        await db
          .select()
          .from(sources)
          .orderBy(desc(sources.createdAt))
          .limit(20)
      ),
    },
  ],
}));

server.resource("actions-pending", "brain://actions/pending", async (uri) => ({
  contents: [
    {
      uri: uri.href,
      mimeType: "application/json",
      text: JSON.stringify(
        await db
          .select()
          .from(actions)
          .where(eq(actions.status, "pending"))
          .orderBy(desc(actions.createdAt))
          .limit(20)
      ),
    },
  ],
}));

server.resource("reports-latest", "brain://reports/latest", async (uri) => ({
  contents: [
    {
      uri: uri.href,
      mimeType: "application/json",
      text: JSON.stringify(
        await db
          .select()
          .from(reports)
          .orderBy(desc(reports.generatedAt))
          .limit(5)
      ),
    },
  ],
}));

// ─── Tools: allow external AI to interact ────────────────────

server.tool(
  "search_sources",
  "Search through accumulated knowledge sources by keyword",
  { query: z.string().describe("Search keyword") },
  async ({ query }) => {
    const allSources = await db
      .select()
      .from(sources)
      .orderBy(desc(sources.createdAt))
      .limit(100);

    const keyword = query.toLowerCase();
    const matched = allSources.filter(
      (s) =>
        s.title.toLowerCase().includes(keyword) ||
        s.content.toLowerCase().includes(keyword) ||
        (s.summary?.toLowerCase().includes(keyword) ?? false)
    );

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(matched.slice(0, 20), null, 2),
        },
      ],
    };
  }
);

server.tool(
  "get_thought_history",
  "Retrieve recent thought history and knowledge timeline",
  {
    limit: z
      .number()
      .min(1)
      .max(50)
      .default(10)
      .describe("Number of entries to retrieve"),
  },
  async ({ limit }) => {
    const history = await db
      .select()
      .from(sources)
      .orderBy(desc(sources.createdAt))
      .limit(limit);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(history, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "get_pending_actions",
  "Get AI-suggested actions that are still pending",
  {},
  async () => {
    const pending = await db
      .select()
      .from(actions)
      .where(eq(actions.status, "pending"))
      .orderBy(desc(actions.createdAt))
      .limit(20);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(pending, null, 2),
        },
      ],
    };
  }
);

// ─── Start ───────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🧠 2nd Brain MCP server running on stdio");
}

main().catch(console.error);
