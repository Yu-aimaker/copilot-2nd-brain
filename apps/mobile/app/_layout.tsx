import '../global.css';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { initializeNotifications } from '../lib/notifications';

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    initializeNotifications();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ title: 'AI対話' }} />
      </Stack>
    </QueryClientProvider>
  );
}
