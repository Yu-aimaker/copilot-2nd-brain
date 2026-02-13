import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "../db";
import { actions } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { suggestActions } from "../services/ai";

export const actionRouter = router({
  /** List actions, newest first */
  list: publicProcedure
    .input(
      z
        .object({
          status: z
            .enum(["pending", "in_progress", "done", "skipped"])
            .optional(),
          limit: z.number().min(1).max(100).default(50),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { limit = 50, status } = input ?? {};
      let query = db
        .select()
        .from(actions)
        .orderBy(desc(actions.createdAt))
        .limit(limit);

      if (status) {
        query = db
          .select()
          .from(actions)
          .where(eq(actions.status, status))
          .orderBy(desc(actions.createdAt))
          .limit(limit);
      }

      return query;
    }),

  /** Update action status */
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.enum(["pending", "in_progress", "done", "skipped"]),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(actions)
        .set({ status: input.status })
        .where(eq(actions.id, input.id));
      const rows = await db
        .select()
        .from(actions)
        .where(eq(actions.id, input.id));
      return rows[0]!;
    }),

  /** Trigger AI to generate new action suggestions from accumulated sources */
  generateSuggestions: publicProcedure.mutation(async () => {
    const suggestions = await suggestActions();

    const created = [];
    for (const suggestion of suggestions) {
      const id = uuid();
      await db.insert(actions).values({
        id,
        title: suggestion.title,
        description: suggestion.description,
        sourceIds: suggestion.relatedSourceIds,
        priority: suggestion.priority,
        reasoning: suggestion.reasoning,
      });
      created.push({ id, ...suggestion });
    }

    return created;
  }),
});
