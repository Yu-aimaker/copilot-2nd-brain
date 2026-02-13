import { initTRPC } from '@trpc/server';
import { db } from '../db';

export const createTRPCContext = () => {
  return { db };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
