// Media Types
export enum MediaType {
  TEXT_MEMO = 'text_memo',
  THOUGHT = 'thought',
  LINK = 'link',
  X_POST = 'x_post',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  PDF = 'pdf',
  MARKDOWN = 'markdown',
  FILE = 'file',
}

// Priority Levels
export enum Priority {
  URGENT = 'urgent',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

// Source Status
export enum SourceStatus {
  UNPROCESSED = 'unprocessed',
  PROCESSED = 'processed',
  ARCHIVED = 'archived',
}

// Highlight Period
export enum HighlightPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

// Next Action Category
export enum NextActionCategory {
  INFORMATION_GATHERING = 'information_gathering',
  LEARNING = 'learning',
  EXECUTION = 'execution',
  REFLECTION = 'reflection',
}

// Next Action Status
export enum NextActionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  DISMISSED = 'dismissed',
}

// Chat Role
export enum ChatRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

// Source Interface
export interface Source {
  id: string;
  content: string;
  mediaType: MediaType;
  url?: string;
  filePath?: string;
  category?: string;
  project?: string;
  priority: Priority;
  aiTags: string[];
  summary?: string;
  status: SourceStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Highlight Interface
export interface Highlight {
  id: string;
  date: Date;
  period: HighlightPeriod;
  content: Record<string, any>;
  totalSources: number;
  categorySummary: Record<string, any>;
  createdAt: Date;
}

// Next Action Interface
export interface NextAction {
  id: string;
  title: string;
  description: string;
  reason: string;
  category: NextActionCategory;
  priority: Priority;
  relatedSourceIds: string[];
  status: NextActionStatus;
  createdAt: Date;
}

// Chat Message Interface
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: Date;
}

// Create Source Input
export interface CreateSourceInput {
  content: string;
  mediaType?: MediaType;
  url?: string;
  filePath?: string;
  category?: string;
  project?: string;
}

// Update Source Input
export interface UpdateSourceInput {
  id: string;
  content?: string;
  category?: string;
  project?: string;
  priority?: Priority;
  status?: SourceStatus;
}

// Source Filters
export interface SourceFilters {
  mediaType?: MediaType;
  category?: string;
  project?: string;
  priority?: Priority;
  status?: SourceStatus;
  startDate?: Date;
  endDate?: Date;
}

// Source Stats
export interface SourceStats {
  total: number;
  byMediaType: Record<MediaType, number>;
  byCategory: Record<string, number>;
  byPriority: Record<Priority, number>;
}

// Chat Send Input
export interface ChatSendInput {
  content: string;
}
