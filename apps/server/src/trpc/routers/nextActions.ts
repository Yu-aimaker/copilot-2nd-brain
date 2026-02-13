import { z } from 'zod';
import { router, publicProcedure } from '../context';
import { nextActions, sources } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { NextActionStatus, Priority } from '@copilot-2nd-brain/shared';
import { suggestNextActions } from '../../ai/suggest';

export const nextActionsRouter = router({
  // Get all next actions
  getAll: publicProcedure
    .input(
      z.object({
        status: z.nativeEnum(NextActionStatus).optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = ctx.db
        .select()
        .from(nextActions)
        .orderBy(desc(nextActions.createdAt))
        .limit(input.limit);
      
      if (input.status) {
        query.where(eq(nextActions.status, input.status));
      }
      
      return await query;
    }),

  // Get highlight (most important) next action
  getHighlight: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select()
      .from(nextActions)
      .where(eq(nextActions.status, NextActionStatus.PENDING))
      .orderBy(desc(nextActions.priority), desc(nextActions.createdAt))
      .limit(1);
    
    return result[0] || null;
  }),

  // Update next action status
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(NextActionStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(nextActions)
        .set({ status: input.status })
        .where(eq(nextActions.id, input.id));
      
      return { success: true };
    }),

  // Generate next actions based on recent sources
  generate: publicProcedure.mutation(async ({ ctx }) => {
    // Get recent sources
    const recentSources = await ctx.db
      .select()
      .from(sources)
      .orderBy(desc(sources.createdAt))
      .limit(10);
    
    // Generate suggestions using AI
    const suggestions = await suggestNextActions(recentSources);
    
    // Insert generated actions
    const inserted = [];
    for (const suggestion of suggestions) {
      const id = uuidv4();
      const action = {
        id,
        ...suggestion,
        status: NextActionStatus.PENDING,
      };
      
      await ctx.db.insert(nextActions).values(action);
      inserted.push(action);
    }
    
    return inserted;
  }),
});
