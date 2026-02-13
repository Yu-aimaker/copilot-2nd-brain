// ─── Source Types ──────────────────────────────────────────────
export type SourceType =
  | "text"
  | "url"
  | "image"
  | "audio"
  | "video"
  | "pdf"
  | "file";

export type Priority = "high" | "medium" | "low";

export interface Source {
  id: string;
  type: SourceType;
  title: string;
  content: string;
  url?: string;
  summary?: string;
  tags: string[];
  priority: Priority;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSourceInput {
  type: SourceType;
  title: string;
  content: string;
  url?: string;
}

// ─── Action Types ─────────────────────────────────────────────
export type ActionStatus = "pending" | "in_progress" | "done" | "skipped";

export interface Action {
  id: string;
  title: string;
  description: string;
  sourceIds: string[];
  status: ActionStatus;
  dueDate?: string;
  priority: Priority;
  reasoning: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Project Types ────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
}

// ─── Report Types ─────────────────────────────────────────────
export type ReportType = "daily" | "weekly" | "monthly";

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  content: string;
  insights: string[];
  generatedAt: string;
}

// ─── AI Pipeline Types ───────────────────────────────────────
export interface AISummaryResult {
  summary: string;
  tags: string[];
  priority: Priority;
  projectId?: string;
}

export interface AIActionSuggestion {
  title: string;
  description: string;
  reasoning: string;
  priority: Priority;
  relatedSourceIds: string[];
}

// ─── MCP Types ────────────────────────────────────────────────
export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface MCPResourceDefinition {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

// ─── Calendar Types ──────────────────────────────────────────
export interface DayRecord {
  date: string;
  sourceCount: number;
  actionCount: number;
  sources: Source[];
  actions: Action[];
}
