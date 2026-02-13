import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "../db";
import { sources } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { processSourceWithAI } from "../services/ai";

export const sourceRouter = router({
  /** List all sources, newest first */
  list: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { limit = 50, offset = 0 } = input ?? {};
      return db
        .select()
        .from(sources)
        .orderBy(desc(sources.createdAt))
        .limit(limit)
        .offset(offset);
    }),

  /** Get a single source by ID */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const rows = await db
        .select()
        .from(sources)
        .where(eq(sources.id, input.id));
      return rows[0] ?? null;
    }),

  /** Create a source – triggers AI pipeline automatically */
  create: publicProcedure
    .input(
      z.object({
        type: z.enum(["text", "url", "image", "audio", "video", "pdf", "file"]),
        title: z.string().min(1),
        content: z.string().min(1),
        url: z.string().url().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const id = uuid();

      // AI auto-processing pipeline
      const aiResult = await processSourceWithAI(input);

      await db.insert(sources).values({
        id,
        type: input.type,
        title: input.title,
        content: input.content,
        url: input.url ?? null,
        summary: aiResult.summary,
        tags: aiResult.tags,
        priority: aiResult.priority,
        projectId: aiResult.projectId ?? null,
      });

      const rows = await db
        .select()
        .from(sources)
        .where(eq(sources.id, id));
      return rows[0]!;
    }),

  /** Delete a source */
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(sources).where(eq(sources.id, input.id));
      return { success: true };
    }),
});
