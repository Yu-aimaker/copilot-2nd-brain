# Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     2nd Brain System                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   Mobile App         │         │   External AI        │
│  (React Native)      │         │   Assistants         │
│                      │         │                      │
│  ┌────────────────┐  │         │  ┌────────────────┐  │
│  │  HOME Tab      │  │         │  │  Claude/GPT    │  │
│  │  - Sources     │  │         │  │  - MCP Client  │  │
│  └────────────────┘  │         │  └────────────────┘  │
│                      │         │                      │
│  ┌────────────────┐  │         └──────────┬───────────┘
│  │  RECORD Tab    │  │                    │
│  │  - Calendar    │  │                    │
│  └────────────────┘  │                    │ MCP Protocol
│                      │                    │
│  ┌────────────────┐  │                    │
│  │  NEXT Tab      │  │                    │
│  │  - Actions     │  │                    ▼
│  └────────────────┘  │         ┌──────────────────────┐
│                      │         │   MCP Server         │
│  ┌────────────────┐  │         │  (REST Endpoints)    │
│  │  tRPC Client   │  │         │                      │
│  └────────┬────────┘  │         │  /thinking-history   │
│           │           │         │  /query              │
└───────────┼───────────┘         │  /context            │
            │                     │  /health             │
            │ tRPC/HTTP           └──────────┬───────────┘
            │                                │
            ▼                                │
┌──────────────────────────────────────────┐ │
│         Backend Server                    │ │
│        (Express + tRPC)                   │ │
│                                          │ │
│  ┌────────────────────────────────────┐  │ │
│  │         tRPC Router                │  │ │
│  │                                    │  │ │
│  │  • sources.*  (CRUD + AI)         │  │ │
│  │  • projects.* (Organization)       │  │ │
│  │  • actions.*  (Todos + AI)        │  │ │
│  │  • tags.*     (Management)        │  │ │
│  │  • reports.*  (Analytics)         │  │ │
│  └────────────┬───────────────────────┘  │ │
│               │                          │ │
│               ▼                          │ │
│  ┌────────────────────────────────────┐  │ │
│  │         AI Service                 │  │ │
│  │                                    │  │ │
│  │  • Media Type Detection            │  │ │
│  │  • Summary Generation              │  │ │
│  │  • Tag Extraction                  │  │ │
│  │  • Priority Assignment             │  │ │
│  │  • Action Suggestions              │  │ │
│  │  • Report Generation               │  │ │
│  └────────────┬───────────────────────┘  │ │
│               │                          │ │
│               ▼                          │ │
│  ┌────────────────────────────────────┐  │ │
│  │      Database Layer                │  │ │
│  │      (Drizzle ORM)                 │  │ │
│  │                                    │  │ │
│  │  Connection Pool ──────────────┐   │  │ │
│  └────────────────────────────────┼───┘  │ │
│                                   │      │ │
└───────────────────────────────────┼──────┘ │
                                    │        │
                                    ▼        │
                          ┌──────────────────┴─────┐
                          │    MySQL Database      │
                          │                        │
                          │  Tables:               │
                          │  • sources             │
                          │  • projects            │
                          │  • actions             │
                          │  • reports             │
                          │  • tags                │
                          └────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Data Flow Example                         │
└─────────────────────────────────────────────────────────────┘

User Creates Source:
1. User taps FAB → Opens modal
2. User enters content → Submits
3. tRPC Client → sources.create mutation
4. Backend receives content
5. AI Service processes:
   - Detects media type (TEXT/LINK/CODE/etc.)
   - Generates summary
   - Extracts tags (#meeting, #important)
   - Assigns priority (HIGH/MEDIUM/LOW)
6. Drizzle ORM → INSERT into sources table
7. Update tags table (increment counts)
8. Return processed source to client
9. React Query updates cache
10. UI re-renders with new source

Action Suggestion Flow:
1. User opens NEXT tab
2. tRPC Client → actions.suggestActions query
3. Backend fetches recent sources
4. AI Service analyzes:
   - High priority sources
   - Meeting tags
   - Related content
5. Generates action suggestions
6. Returns to client
7. Displays as "AI Suggestions" section

MCP Query Flow:
1. External AI makes request → POST /mcp/query
2. MCP Routes receives query + filters
3. Database query with filters
4. Process results
5. Return JSON response
6. External AI uses data for conversation context

┌─────────────────────────────────────────────────────────────┐
│                    Technology Stack                          │
└─────────────────────────────────────────────────────────────┘

Mobile:                  Backend:                Shared:
├─ React Native         ├─ Express.js           ├─ TypeScript 5.9
├─ Expo SDK 54          ├─ tRPC 11              ├─ Zod schemas
├─ Expo Router 6        ├─ Drizzle ORM          └─ Type definitions
├─ NativeWind 4         ├─ MySQL 8
├─ TanStack Query       └─ TypeScript 5.9
└─ TypeScript 5.9

┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
└─────────────────────────────────────────────────────────────┘

1. Input Validation (Zod schemas)
   ↓
2. Type Safety (TypeScript + tRPC)
   ↓
3. Database (Parameterized queries via Drizzle)
   ↓
4. Environment Variables (Sensitive config)
   ↓
5. CORS (Controlled origins)

Future: Add JWT/OAuth2 authentication layer
```
