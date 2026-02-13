import { router } from './context';
import { sourcesRouter } from './routers/sources';
import { highlightsRouter } from './routers/highlights';
import { nextActionsRouter } from './routers/nextActions';
import { chatRouter } from './routers/chat';

export const appRouter = router({
  sources: sourcesRouter,
  highlights: highlightsRouter,
  nextActions: nextActionsRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
