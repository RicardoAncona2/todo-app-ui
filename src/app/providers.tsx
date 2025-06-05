'use client';

import { ApolloProvider } from '@apollo/client';
import { client } from '@/lib';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
    </ApolloProvider>
  );
}
