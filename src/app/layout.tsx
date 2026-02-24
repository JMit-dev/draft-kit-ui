import type { Metadata } from 'next';
import { Providers } from './providers';
import { ErrorBoundary } from '@/shared/components/feedback/error-boundary';
import './globals.css';

export const metadata: Metadata = {
  title: 'Draft Kit UI',
  description: 'Fantasy Baseball Draft Management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
