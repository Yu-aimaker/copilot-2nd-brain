import { z } from 'zod';
import { router, publicProcedure } from '../context';
import { highlights, sources } from '../../db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { HighlightPeriod } from '@copilot-2nd-brain/shared';

export const highlightsRouter = router({
  // Get highlight by date
  getByDate: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(highlights)
        .where(eq(highlights.date, input.date))
        .limit(1);
      
      return result[0] || null;
    }),

  // Get highlights by period
  getByPeriod: publicProcedure
    .input(
      z.object({
        period: z.nativeEnum(HighlightPeriod),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(highlights)
        .where(
          and(
            eq(highlights.period, input.period),
            gte(highlights.date, input.startDate),
            lte(highlights.date, input.endDate)
          )
        )
        .orderBy(desc(highlights.date));
      
      return result;
    }),

  // Generate highlight for a specific date
  generate: publicProcedure
    .input(
      z.object({
        date: z.date(),
        period: z.nativeEnum(HighlightPeriod).default(HighlightPeriod.DAILY),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const startOfDay = new Date(input.date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(input.date);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Get all sources for this day
      const daySources = await ctx.db
        .select()
        .from(sources)
        .where(
          and(
            gte(sources.createdAt, startOfDay),
            lte(sources.createdAt, endOfDay)
          )
        );
      
      // Generate category summary
      const categorySummary: Record<string, number> = {};
      for (const source of daySources) {
        if (source.category) {
          categorySummary[source.category] = (categorySummary[source.category] || 0) + 1;
        }
      }
      
      // Generate highlight content
      const content = {
        topSources: daySources.slice(0, 3).map((s) => ({
          id: s.id,
          content: s.content.substring(0, 100),
          category: s.category,
          priority: s.priority,
        })),
        insights: `今日は${daySources.length}件のSOURCEを保存しました。`,
      };
      
      const id = uuidv4();
      const newHighlight = {
        id,
        date: input.date,
        period: input.period,
        content,
        totalSources: daySources.length,
        categorySummary,
      };
      
      await ctx.db.insert(highlights).values(newHighlight);
      
      return newHighlight;
    }),
});
