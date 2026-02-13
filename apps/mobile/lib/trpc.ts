import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@2nd-brain/server/src/router";

export const trpc = createTRPCReact<AppRouter>();
