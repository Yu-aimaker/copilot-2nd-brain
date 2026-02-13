import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "../db";
import { reports } from "../db/schema";
import { desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { generateReport } from "../services/ai";

export const reportRouter = router({
  /** List generated reports */
  list: publicProcedure
    .input(
      z
        .object({
          type: z.enum(["daily", "weekly", "monthly"]).optional(),
          limit: z.number().min(1).max(50).default(20),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const { limit = 20 } = input ?? {};
      return db
        .select()
        .from(reports)
        .orderBy(desc(reports.generatedAt))
        .limit(limit);
    }),

  /** Generate a new report */
  generate: publicProcedure
    .input(
      z.object({
        type: z.enum(["daily", "weekly", "monthly"]),
      })
    )
    .mutation(async ({ input }) => {
      const result = await generateReport(input.type);
      const id = uuid();

      await db.insert(reports).values({
        id,
        type: input.type,
        title: result.title,
        content: result.content,
        insights: result.insights,
      });

      return { id, ...result };
    }),
});
