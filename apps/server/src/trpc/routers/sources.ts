import { z } from 'zod';
import { router, publicProcedure } from '../context';
import { sources } from '../../db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { processSource, detectMediaType } from '../../ai/pipeline';
import { MediaType, Priority, SourceStatus } from '@copilot-2nd-brain/shared';

export const sourcesRouter = router({
  // Create a new source
  create: publicProcedure
    .input(
      z.object({
        content: z.string(),
        mediaType: z.nativeEnum(MediaType).optional(),
        url: z.string().optional(),
        filePath: z.string().optional(),
        category: z.string().optional(),
        project: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = uuidv4();
      
      // Detect media type if not provided
      const mediaType = input.mediaType || detectMediaType(input.content, input.url);
      
      // Process with AI pipeline
      const processed = await processSource(input.content, mediaType);
      
      const newSource = {
        id,
        content: input.content,
        mediaType,
        url: input.url,
        filePath: input.filePath,
        category: input.category || processed.category,
        project: input.project,
        priority: processed.priority,
        aiTags: processed.aiTags,
        summary: processed.summary,
        status: SourceStatus.PROCESSED,
      };
      
      await ctx.db.insert(sources).values(newSource);
      
      return newSource;
    }),

  // Get all sources with optional filters
  getAll: publicProcedure
    .input(
      z.object({
        mediaType: z.nativeEnum(MediaType).optional(),
        category: z.string().optional(),
        project: z.string().optional(),
        priority: z.nativeEnum(Priority).optional(),
        status: z.nativeEnum(SourceStatus).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];
      
      if (input.mediaType) conditions.push(eq(sources.mediaType, input.mediaType));
      if (input.category) conditions.push(eq(sources.category, input.category));
      if (input.project) conditions.push(eq(sources.project, input.project));
      if (input.priority) conditions.push(eq(sources.priority, input.priority));
      if (input.status) conditions.push(eq(sources.status, input.status));
      if (input.startDate) conditions.push(gte(sources.createdAt, input.startDate));
      if (input.endDate) conditions.push(lte(sources.createdAt, input.endDate));
      
      const result = await ctx.db
        .select()
        .from(sources)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(sources.createdAt))
        .limit(input.limit)
        .offset(input.offset);
      
      return result;
    }),

  // Get source by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(sources)
        .where(eq(sources.id, input.id))
        .limit(1);
      
      return result[0] || null;
    }),

  // Get sources by date
  getByDate: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      const startOfDay = new Date(input.date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(input.date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const result = await ctx.db
        .select()
        .from(sources)
        .where(
          and(
            gte(sources.createdAt, startOfDay),
            lte(sources.createdAt, endOfDay)
          )
        )
        .orderBy(desc(sources.createdAt));
      
      return result;
    }),

  // Update source
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().optional(),
        category: z.string().optional(),
        project: z.string().optional(),
        priority: z.nativeEnum(Priority).optional(),
        status: z.nativeEnum(SourceStatus).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      
      await ctx.db
        .update(sources)
        .set(updates)
        .where(eq(sources.id, id));
      
      return { success: true };
    }),

  // Delete source
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(sources)
        .where(eq(sources.id, input.id));
      
      return { success: true };
    }),

  // Get statistics
  getStats: publicProcedure.query(async ({ ctx }) => {
    const allSources = await ctx.db.select().from(sources);
    
    const stats = {
      total: allSources.length,
      byMediaType: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
    };
    
    for (const source of allSources) {
      stats.byMediaType[source.mediaType] = (stats.byMediaType[source.mediaType] || 0) + 1;
      if (source.category) {
        stats.byCategory[source.category] = (stats.byCategory[source.category] || 0) + 1;
      }
      stats.byPriority[source.priority] = (stats.byPriority[source.priority] || 0) + 1;
    }
    
    return stats;
  }),
});
