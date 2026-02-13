import { z } from 'zod';

// Media Types
export enum MediaType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  LINK = 'LINK',
  PDF = 'PDF',
  CODE = 'CODE',
}

// Priority Levels
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// Source Schema
export const SourceSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  mediaType: z.nativeEnum(MediaType),
  summary: z.string().optional(),
  tags: z.array(z.string()),
  priority: z.nativeEnum(Priority),
  projectId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Source = z.infer<typeof SourceSchema>;

// Project Schema
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  color: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Project = z.infer<typeof ProjectSchema>;

// Action Schema (for NEXT tab)
export const ActionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  priority: z.nativeEnum(Priority),
  projectId: z.string().uuid().optional(),
  sourceIds: z.array(z.string().uuid()),
  completed: z.boolean(),
  dueDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Action = z.infer<typeof ActionSchema>;

// Report Schema
export const ReportSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  period: z.object({
    start: z.date(),
    end: z.date(),
  }),
  insights: z.array(z.string()),
  createdAt: z.date(),
});

export type Report = z.infer<typeof ReportSchema>;

// Tag Schema
export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  count: z.number(),
  createdAt: z.date(),
});

export type Tag = z.infer<typeof TagSchema>;

// MCP Types for external AI access
export interface MCPThinkingHistory {
  sources: Source[];
  actions: Action[];
  reports: Report[];
  timeRange?: {
    start: Date;
    end: Date;
  };
}

export interface MCPQuery {
  query: string;
  filters?: {
    mediaType?: MediaType[];
    priority?: Priority[];
    projectId?: string;
    tags?: string[];
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
  limit?: number;
}

export interface MCPResponse {
  results: Source[];
  summary: string;
  relevantActions: Action[];
}
