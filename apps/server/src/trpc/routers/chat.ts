import { z } from 'zod';
import { router, publicProcedure } from '../context';
import { chatMessages } from '../../db/schema';
import { desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { ChatRole } from '@copilot-2nd-brain/shared';

export const chatRouter = router({
  // Send a message and get AI response
  send: publicProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Save user message
      const userMessageId = uuidv4();
      await ctx.db.insert(chatMessages).values({
        id: userMessageId,
        role: ChatRole.USER,
        content: input.content,
      });
      
      // Generate AI response (mock)
      const aiResponse = `あなたのメッセージ「${input.content}」を受け取りました。2nd Brainとして、あなたの思考を拡張するお手伝いをします。`;
      
      const assistantMessageId = uuidv4();
      await ctx.db.insert(chatMessages).values({
        id: assistantMessageId,
        role: ChatRole.ASSISTANT,
        content: aiResponse,
      });
      
      return {
        userMessage: { id: userMessageId, role: ChatRole.USER, content: input.content },
        assistantMessage: { id: assistantMessageId, role: ChatRole.ASSISTANT, content: aiResponse },
      };
    }),

  // Get chat history
  getHistory: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(chatMessages)
        .orderBy(desc(chatMessages.createdAt))
        .limit(input.limit);
      
      return result.reverse(); // Return in chronological order
    }),
});
