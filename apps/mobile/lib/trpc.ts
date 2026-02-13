import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../server/src/trpc/router';
import Constants from 'expo-constants';

const getApiUrl = () => {
  const { debuggerHost } = Constants.expoConfig?.hostUri
    ? { debuggerHost: Constants.expoConfig.hostUri.split(':').shift() }
    : { debuggerHost: 'localhost' };
  return `http://${debuggerHost}:3000/trpc`;
};

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getApiUrl(),
    }),
  ],
});
