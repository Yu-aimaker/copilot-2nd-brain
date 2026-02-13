import { router } from "../trpc";
import { sourceRouter } from "./source";
import { actionRouter } from "./action";
import { reportRouter } from "./report";

export const appRouter = router({
  source: sourceRouter,
  action: actionRouter,
  report: reportRouter,
});

export type AppRouter = typeof appRouter;
