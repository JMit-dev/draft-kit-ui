'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { queryClient } from '@/lib/react-query';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ChakraProvider>
  );
}
