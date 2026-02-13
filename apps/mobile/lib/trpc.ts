import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@copilot-2nd-brain/server/trpc';
import Constants from 'expo-constants';

const getApiUrl = () => {
  // Get the debugger host from Expo config, or default to localhost
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri ? hostUri.split(':')[0] : 'localhost';
  return `http://${host}:3000/trpc`;
};

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getApiUrl(),
    }),
  ],
});
