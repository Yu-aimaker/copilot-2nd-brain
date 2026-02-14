# 2nd Brain - Intelligent Knowledge Management System

A sophisticated knowledge management application that leverages AI to transform your inputs into an intelligent knowledge base. The system automatically processes, categorizes, and analyzes your information to provide actionable insights and suggestions.

## 🌟 Features

### Core Functionality
- **3-Tab Interface**
  - **HOME**: Source feed with AI-powered tagging and summarization
  - **RECORD**: Calendar view of your knowledge timeline
  - **NEXT**: AI-suggested actions based on accumulated knowledge

### AI-Powered Processing
- Automatic media type detection (TEXT, IMAGE, VIDEO, AUDIO, LINK, PDF, CODE)
- Auto-generated summaries and tags
- Intelligent priority assignment
- Project attribute association
- Cross-analysis for action suggestions
- Periodic report generation

### MCP Integration
- External AI access to thinking history
- Query accumulated information API
- Context retrieval for AI assistants
- RESTful endpoints for external integration

### UI/UX
- White-based sophisticated design
- Floating action button for quick saves
- Smooth animations and transitions
- Responsive layouts

## 🏗️ Architecture

### Monorepo Structure
```
copilot-2nd-brain/
├── apps/
│   ├── mobile/          # React Native + Expo mobile app
│   │   ├── app/         # Expo Router pages
│   │   │   ├── (tabs)/  # Tab navigation
│   │   │   │   ├── home.tsx
│   │   │   │   ├── record.tsx
│   │   │   │   └── next.tsx
│   │   │   └── _layout.tsx
│   │   ├── src/
│   │   │   └── utils/
│   │   │       └── trpc.ts
│   │   └── package.json
│   │
│   └── server/          # Express + tRPC backend
│       ├── src/
│       │   ├── db/
│       │   │   ├── schema.ts    # Drizzle ORM schema
│       │   │   └── index.ts
│       │   ├── routes/
│       │   │   ├── trpc.ts
│       │   │   └── index.ts     # tRPC router
│       │   ├── services/
│       │   │   └── ai.service.ts
│       │   ├── mcp/
│       │   │   └── routes.ts    # MCP endpoints
│       │   └── index.ts
│       └── package.json
│
└── packages/
    └── shared/          # Shared types and schemas
        ├── src/
        │   ├── types.ts
        │   ├── schemas.ts
        │   └── index.ts
        └── package.json
```

## 🛠️ Technology Stack

### Mobile App
- **React Native** - Cross-platform mobile framework
- **Expo SDK 54** - Development and build tooling
- **Expo Router 6** - File-based routing
- **NativeWind 4** - Tailwind CSS for React Native
- **TanStack Query** - Data fetching and caching
- **tRPC Client** - Type-safe API client

### Backend
- **Express** - Web server framework
- **tRPC** - End-to-end typesafe APIs
- **MySQL** - Relational database
- **Drizzle ORM** - TypeScript ORM
- **TypeScript 5.9** - Type safety

### Shared
- **Zod** - Schema validation
- **TypeScript** - Shared types

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MySQL 8+
- Yarn 4+

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Yu-aimaker/copilot-2nd-brain.git
cd copilot-2nd-brain
```

2. **Install dependencies**
```bash
yarn install
```

3. **Configure the database**

Create a MySQL database:
```sql
CREATE DATABASE second_brain;
```

Copy the environment file and configure:
```bash
cd apps/server
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=second_brain
PORT=3000
OPENAI_API_KEY=your_openai_key  # Optional for enhanced AI
```

4. **Run database migrations**
```bash
cd apps/server
yarn db:generate
yarn db:migrate
```

5. **Start the development servers**

Terminal 1 - Backend:
```bash
yarn server
```

Terminal 2 - Mobile:
```bash
yarn mobile
```

## 🚀 Usage

### Adding Sources
1. Tap the floating action button (+) on the HOME tab
2. Enter your content (text, URL, code, etc.)
3. The AI will automatically:
   - Detect the media type
   - Generate a summary
   - Extract relevant tags
   - Assign a priority level

### Viewing Calendar
1. Navigate to the RECORD tab
2. Tap any date to see sources created that day
3. Dots indicate days with activity

### Managing Actions
1. Navigate to the NEXT tab
2. View AI-suggested actions at the top
3. Check off completed actions
4. Add custom actions with the (+) button

### MCP API Access

The MCP server provides endpoints for external AI access:

**Get Thinking History**
```bash
GET http://localhost:3000/mcp/thinking-history?startDate=2024-01-01&endDate=2024-12-31&limit=100
```

**Query Information**
```bash
POST http://localhost:3000/mcp/query
Content-Type: application/json

{
  "query": "meeting notes",
  "filters": {
    "priority": ["HIGH", "URGENT"],
    "mediaType": ["TEXT"]
  },
  "limit": 20
}
```

**Get Context**
```bash
GET http://localhost:3000/mcp/context?contextSize=10
```

## 📊 Database Schema

### Sources Table
- `id` - UUID primary key
- `content` - Text content
- `mediaType` - Type of media (TEXT, IMAGE, etc.)
- `summary` - AI-generated summary
- `tags` - JSON array of tags
- `priority` - Priority level (LOW, MEDIUM, HIGH, URGENT)
- `projectId` - Optional project reference
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Projects Table
- `id` - UUID primary key
- `name` - Project name
- `description` - Project description
- `color` - Hex color code
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Actions Table
- `id` - UUID primary key
- `title` - Action title
- `description` - Action description
- `priority` - Priority level
- `projectId` - Optional project reference
- `sourceIds` - JSON array of source IDs
- `completed` - Boolean
- `dueDate` - Optional due date
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Reports Table
- `id` - UUID primary key
- `title` - Report title
- `content` - Report content
- `periodStart` - Period start date
- `periodEnd` - Period end date
- `insights` - JSON array of insights
- `createdAt` - Timestamp

### Tags Table
- `id` - UUID primary key
- `name` - Tag name (unique)
- `count` - Usage count
- `createdAt` - Timestamp

## 🤖 AI Service

The AI service provides several capabilities:

### Media Type Detection
Automatically detects content type based on:
- URL patterns (images, videos, PDFs, etc.)
- Code syntax
- Text content

### Auto-Tagging
Extracts tags from:
- Hashtags in content
- Common keywords
- Context analysis

### Priority Assignment
Determines priority based on:
- Urgency indicators (urgent, asap, !!!)
- Importance markers
- Default to MEDIUM

### Action Suggestions
Analyzes sources to suggest:
- Follow-ups on high-priority items
- Meeting action items
- Related task consolidation

### Report Generation
Creates periodic reports with:
- Activity summary
- Key insights
- Priority distribution
- Project activity

## 📱 Mobile App Features

### HOME Tab
- Source feed with infinite scroll
- AI-generated summaries
- Tag visualization
- Priority indicators
- Quick add modal
- Real-time updates

### RECORD Tab
- Calendar interface
- Date markers for activity
- Daily source view
- Time tracking
- Chronological organization

### NEXT Tab
- AI suggestion section
- Action checklist
- Priority visualization
- Due date tracking
- Quick action creation

## 🔧 Development

### Type Safety
All API endpoints are fully type-safe using tRPC. Changes to backend types automatically propagate to the frontend.

### Hot Reload
Both the mobile app and server support hot reload during development.

### Database Management
Use Drizzle Studio to manage the database:
```bash
cd apps/server
yarn db:studio
```

## 🧪 Testing

The application includes:
- Type checking with TypeScript
- API validation with Zod schemas
- End-to-end type safety with tRPC

Run type checking:
```bash
yarn typecheck
```

## 🚢 Deployment

### Mobile App
Build for production:
```bash
cd apps/mobile
yarn build:mobile
```

### Server
Build and start:
```bash
cd apps/server
yarn build
yarn start
```

## 🔒 Security

- Environment variables for sensitive data
- Input validation with Zod
- SQL injection prevention with Drizzle ORM
- CORS configuration for API access

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using React Native, Expo, TypeScript, and tRPC