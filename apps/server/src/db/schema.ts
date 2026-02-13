import {
  mysqlTable,
  varchar,
  text,
  json,
  timestamp,
  mysqlEnum,
  int,
} from "drizzle-orm/mysql-core";

// ─── Sources ──────────────────────────────────────────────────
export const sources = mysqlTable("sources", {
  id: varchar("id", { length: 36 }).primaryKey(),
  type: mysqlEnum("type", [
    "text",
    "url",
    "image",
    "audio",
    "video",
    "pdf",
    "file",
  ]).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  url: text("url"),
  summary: text("summary"),
  tags: json("tags").$type<string[]>().default([]),
  priority: mysqlEnum("priority", ["high", "medium", "low"])
    .notNull()
    .default("medium"),
  projectId: varchar("project_id", { length: 36 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// ─── Actions ──────────────────────────────────────────────────
export const actions = mysqlTable("actions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  sourceIds: json("source_ids").$type<string[]>().default([]),
  status: mysqlEnum("status", [
    "pending",
    "in_progress",
    "done",
    "skipped",
  ])
    .notNull()
    .default("pending"),
  dueDate: timestamp("due_date"),
  priority: mysqlEnum("priority", ["high", "medium", "low"])
    .notNull()
    .default("medium"),
  reasoning: text("reasoning").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// ─── Projects ─────────────────────────────────────────────────
export const projects = mysqlTable("projects", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }).notNull().default("#6366F1"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Reports ──────────────────────────────────────────────────
export const reports = mysqlTable("reports", {
  id: varchar("id", { length: 36 }).primaryKey(),
  type: mysqlEnum("type", ["daily", "weekly", "monthly"]).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  insights: json("insights").$type<string[]>().default([]),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

// ─── Source–Action Join ───────────────────────────────────────
export const sourceActionLinks = mysqlTable("source_action_links", {
  id: int("id").primaryKey().autoincrement(),
  sourceId: varchar("source_id", { length: 36 }).notNull(),
  actionId: varchar("action_id", { length: 36 }).notNull(),
});
