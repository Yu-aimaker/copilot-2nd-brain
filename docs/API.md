# API Documentation

## Overview

The 2nd Brain API provides both tRPC and REST endpoints for managing sources, projects, actions, and accessing MCP functionality.

## Base URLs

- **tRPC API**: `http://localhost:3000/trpc`
- **MCP API**: `http://localhost:3000/mcp`

## Types Reference

### MediaType
```typescript
enum MediaType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  LINK = 'LINK',
  PDF = 'PDF',
  CODE = 'CODE',
}
```

### Priority
```typescript
enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}
```

## MCP REST Endpoints

### GET `/mcp/thinking-history`

Get thinking history with sources, actions, and reports.

**Query Parameters:**
- `startDate` (optional): ISO datetime string
- `endDate` (optional): ISO datetime string
- `limit` (optional): Number, default 100

### POST `/mcp/query`

Query accumulated information with filters.

### GET `/mcp/context`

Get context for AI assistants.

### GET `/mcp/health`

Health check endpoint.

For complete API documentation, see the inline code comments and TypeScript types.
