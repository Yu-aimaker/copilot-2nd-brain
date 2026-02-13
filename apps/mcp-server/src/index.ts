import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/mcp';

// Define available tools
const TOOLS: Tool[] = [
  {
    name: 'get_sources',
    description: 'Get all sources from 2nd Brain',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_source',
    description: 'Get a specific source by ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Source ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'search_sources',
    description: 'Search sources by query',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_highlights',
    description: 'Get recent highlights',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_next_actions',
    description: 'Get pending next actions',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// Create MCP server
const server = new Server(
  {
    name: '2nd-brain-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_sources': {
        const response = await fetch(`${API_BASE_URL}/sources`);
        const data = await response.json();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case 'get_source': {
        const { id } = args as { id: string };
        const response = await fetch(`${API_BASE_URL}/sources/${id}`);
        const data = await response.json();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case 'search_sources': {
        const { query } = args as { query: string };
        const response = await fetch(`${API_BASE_URL}/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
        const data = await response.json();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case 'get_highlights': {
        const response = await fetch(`${API_BASE_URL}/highlights`);
        const data = await response.json();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case 'get_next_actions': {
        const response = await fetch(`${API_BASE_URL}/next-actions`);
        const data = await response.json();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('2nd Brain MCP Server running on stdio');
}

main();
