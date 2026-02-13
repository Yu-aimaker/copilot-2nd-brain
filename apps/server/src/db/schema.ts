import { mysqlTable, varchar, text, timestamp, int, boolean, json } from 'drizzle-orm/mysql-core';

export const sources = mysqlTable('sources', {
  id: varchar('id', { length: 36 }).primaryKey(),
  content: text('content').notNull(),
  mediaType: varchar('media_type', { length: 20 }).notNull(),
  summary: text('summary'),
  tags: json('tags').$type<string[]>().default([]),
  priority: varchar('priority', { length: 20 }).notNull().default('MEDIUM'),
  projectId: varchar('project_id', { length: 36 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export const projects = mysqlTable('projects', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 7 }).notNull().default('#3B82F6'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export const actions = mysqlTable('actions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  priority: varchar('priority', { length: 20 }).notNull(),
  projectId: varchar('project_id', { length: 36 }),
  sourceIds: json('source_ids').$type<string[]>().default([]),
  completed: boolean('completed').notNull().default(false),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export const reports = mysqlTable('reports', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  insights: json('insights').$type<string[]>().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const tags = mysqlTable('tags', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  count: int('count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
