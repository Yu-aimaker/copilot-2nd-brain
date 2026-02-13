import { mysqlTable, varchar, text, json, timestamp, int, mysqlEnum } from 'drizzle-orm/mysql-core';

// Sources table
export const sources = mysqlTable('sources', {
  id: varchar('id', { length: 36 }).primaryKey(),
  content: text('content').notNull(),
  mediaType: mysqlEnum('media_type', [
    'text_memo',
    'thought',
    'link',
    'x_post',
    'image',
    'audio',
    'video',
    'pdf',
    'markdown',
    'file',
  ]).notNull(),
  url: varchar('url', { length: 2048 }),
  filePath: varchar('file_path', { length: 1024 }),
  category: varchar('category', { length: 255 }),
  project: varchar('project', { length: 255 }),
  priority: mysqlEnum('priority', ['urgent', 'high', 'medium', 'low']).notNull().default('medium'),
  aiTags: json('ai_tags').$type<string[]>().notNull().default([]),
  summary: text('summary'),
  status: mysqlEnum('status', ['unprocessed', 'processed', 'archived']).notNull().default('unprocessed'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

// Highlights table
export const highlights = mysqlTable('highlights', {
  id: varchar('id', { length: 36 }).primaryKey(),
  date: timestamp('date').notNull(),
  period: mysqlEnum('period', ['daily', 'weekly', 'monthly']).notNull(),
  content: json('content').$type<Record<string, any>>().notNull(),
  totalSources: int('total_sources').notNull().default(0),
  categorySummary: json('category_summary').$type<Record<string, any>>().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Next Actions table
export const nextActions = mysqlTable('next_actions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  reason: text('reason').notNull(),
  category: mysqlEnum('category', [
    'information_gathering',
    'learning',
    'execution',
    'reflection',
  ]).notNull(),
  priority: mysqlEnum('priority', ['urgent', 'high', 'medium', 'low']).notNull(),
  relatedSourceIds: json('related_source_ids').$type<string[]>().notNull().default([]),
  status: mysqlEnum('status', ['pending', 'completed', 'dismissed']).notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Chat Messages table
export const chatMessages = mysqlTable('chat_messages', {
  id: varchar('id', { length: 36 }).primaryKey(),
  role: mysqlEnum('role', ['user', 'assistant']).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Export types
export type Source = typeof sources.$inferSelect;
export type NewSource = typeof sources.$inferInsert;
export type Highlight = typeof highlights.$inferSelect;
export type NewHighlight = typeof highlights.$inferInsert;
export type NextAction = typeof nextActions.$inferSelect;
export type NewNextAction = typeof nextActions.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
