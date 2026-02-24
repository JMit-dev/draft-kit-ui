'use client';

import { Component, type ReactNode } from 'react';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={8}
        >
          <VStack spacing={4} maxW="md" textAlign="center">
            <Heading size="lg">Something went wrong</Heading>
            <Text color="gray.600">
              We encountered an unexpected error. Please try refreshing the
              page.
            </Text>
            {this.state.error && (
              <Text fontSize="sm" color="red.500" fontFamily="mono">
                {this.state.error.message}
              </Text>
            )}
            <Button colorScheme="blue" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}
