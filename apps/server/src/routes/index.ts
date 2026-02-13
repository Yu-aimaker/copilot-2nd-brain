import { router, publicProcedure } from './trpc';
import { db } from '../db';
import { sources, projects, actions, tags, reports } from '../db/schema';
import { aiService } from '../services/ai.service';
import { 
  CreateSourceInputSchema, 
  UpdateSourceInputSchema,
  CreateProjectInputSchema,
  CreateActionInputSchema,
  UpdateActionInputSchema,
  GetSourcesInputSchema,
  GetActionsInputSchema,
} from '@2nd-brain/shared';
import { eq, desc, and, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const appRouter = router({
  // Source routes
  sources: router({
    create: publicProcedure
      .input(CreateSourceInputSchema)
      .mutation(async ({ input }) => {
        const id = uuidv4();
        
        // Process with AI
        const aiResult = await aiService.processSource(
          input.content, 
          input.mediaType as any
        );

        const [source] = await db.insert(sources).values({
          id,
          content: input.content,
          mediaType: aiResult.mediaType,
          summary: aiResult.summary,
          tags: aiResult.tags,
          priority: aiResult.priority,
          projectId: input.projectId,
        });

        // Update tag counts
        for (const tagName of aiResult.tags) {
          const existingTag = await db.select().from(tags).where(eq(tags.name, tagName)).limit(1);
          if (existingTag.length > 0) {
            await db.update(tags)
              .set({ count: sql`${tags.count} + 1` })
              .where(eq(tags.name, tagName));
          } else {
            await db.insert(tags).values({
              id: uuidv4(),
              name: tagName,
              count: 1,
            });
          }
        }

        return { id, ...input, ...aiResult };
      }),

    list: publicProcedure
      .input(GetSourcesInputSchema)
      .query(async ({ input }) => {
        let query = db.select().from(sources).orderBy(desc(sources.createdAt));
        
        // Apply filters
        const conditions = [];
        if (input.projectId) {
          conditions.push(eq(sources.projectId, input.projectId));
        }
        if (input.priority) {
          conditions.push(eq(sources.priority, input.priority));
        }
        if (input.mediaType) {
          conditions.push(eq(sources.mediaType, input.mediaType));
        }

        if (conditions.length > 0) {
          query = query.where(and(...conditions)) as any;
        }

        const results = await query.limit(input.limit).offset(input.offset);
        return results;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input }) => {
        const [source] = await db.select().from(sources).where(eq(sources.id, input.id));
        return source;
      }),

    update: publicProcedure
      .input(UpdateSourceInputSchema)
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.update(sources).set(updates).where(eq(sources.id, id));
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ input }) => {
        await db.delete(sources).where(eq(sources.id, input.id));
        return { success: true };
      }),
  }),

  // Project routes
  projects: router({
    create: publicProcedure
      .input(CreateProjectInputSchema)
      .mutation(async ({ input }) => {
        const id = uuidv4();
        await db.insert(projects).values({ id, ...input });
        return { id, ...input };
      }),

    list: publicProcedure
      .query(async () => {
        return await db.select().from(projects).orderBy(desc(projects.createdAt));
      }),

    getById: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input }) => {
        const [project] = await db.select().from(projects).where(eq(projects.id, input.id));
        return project;
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ input }) => {
        await db.delete(projects).where(eq(projects.id, input.id));
        return { success: true };
      }),
  }),

  // Action routes
  actions: router({
    create: publicProcedure
      .input(CreateActionInputSchema)
      .mutation(async ({ input }) => {
        const id = uuidv4();
        await db.insert(actions).values({
          id,
          title: input.title,
          description: input.description,
          priority: input.priority,
          projectId: input.projectId,
          sourceIds: input.sourceIds,
          completed: false,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        });
        return { id, ...input, completed: false };
      }),

    list: publicProcedure
      .input(GetActionsInputSchema)
      .query(async ({ input }) => {
        let query = db.select().from(actions).orderBy(desc(actions.createdAt));
        
        const conditions = [];
        if (input.completed !== undefined) {
          conditions.push(eq(actions.completed, input.completed));
        }
        if (input.projectId) {
          conditions.push(eq(actions.projectId, input.projectId));
        }
        if (input.priority) {
          conditions.push(eq(actions.priority, input.priority));
        }

        if (conditions.length > 0) {
          query = query.where(and(...conditions)) as any;
        }

        return await query.limit(input.limit).offset(input.offset);
      }),

    update: publicProcedure
      .input(UpdateActionInputSchema)
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.update(actions).set(updates).where(eq(actions.id, id));
        return { success: true };
      }),

    suggestActions: publicProcedure
      .query(async () => {
        // Get recent sources
        const recentSources = await db.select().from(sources)
          .orderBy(desc(sources.createdAt))
          .limit(50);

        const existingActions = await db.select().from(actions)
          .where(eq(actions.completed, false));

        const suggestions = await aiService.suggestActions(recentSources, existingActions);
        return suggestions;
      }),
  }),

  // Tag routes
  tags: router({
    list: publicProcedure
      .query(async () => {
        return await db.select().from(tags).orderBy(desc(tags.count));
      }),
  }),

  // Report routes
  reports: router({
    generate: publicProcedure
      .input(z.object({
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      }))
      .mutation(async ({ input }) => {
        const start = new Date(input.startDate);
        const end = new Date(input.endDate);

        const periodSources = await db.select().from(sources)
          .where(and(
            sql`${sources.createdAt} >= ${start}`,
            sql`${sources.createdAt} <= ${end}`
          ));

        const periodActions = await db.select().from(actions)
          .where(and(
            sql`${actions.createdAt} >= ${start}`,
            sql`${actions.createdAt} <= ${end}`
          ));

        const report = await aiService.generateReport(
          periodSources,
          periodActions,
          { start, end }
        );

        const id = uuidv4();
        await db.insert(reports).values({
          id,
          title: report.title,
          content: report.content,
          periodStart: start,
          periodEnd: end,
          insights: report.insights,
        });

        return { id, ...report };
      }),

    list: publicProcedure
      .query(async () => {
        return await db.select().from(reports).orderBy(desc(reports.createdAt));
      }),
  }),
});

export type AppRouter = typeof appRouter;
