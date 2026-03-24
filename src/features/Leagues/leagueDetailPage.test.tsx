import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import LeagueDetailPage from './leagueDetailPage';

const pushMock = vi.fn();
const deleteMutateAsyncMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('./hooks/useLeague', () => ({
  useLeague: () => ({
    isLoading: false,
    error: null,
    data: {
      data: {
        _id: 'league-123',
        externalId: 'custom-league-123',
        name: 'My League',
        teams: 12,
        draftType: 'auction',
        rosterSlots: {
          C: 1,
          '1B': 1,
          '2B': 1,
          '3B': 1,
          SS: 1,
          OF: 3,
          DH: 0,
          SP: 5,
          RP: 2,
          UTIL: 0,
          BENCH: 0,
        },
      },
    },
  }),
}));

vi.mock('./hooks/useDeleteLeague', () => ({
  useDeleteLeague: () => ({
    mutateAsync: deleteMutateAsyncMock,
    isPending: false,
    isError: false,
  }),
}));

vi.mock('./components/UpsertLeagueModal', () => ({
  default: () => null,
}));

describe('LeagueDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('confirms and deletes a league, then navigates back to leagues list', async () => {
    deleteMutateAsyncMock.mockResolvedValue({});

    render(
      <ChakraProvider>
        <LeagueDetailPage leagueId="league-123" />
      </ChakraProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    const dialog = await screen.findByRole('alertdialog');
    const dialogScope = within(dialog);

    fireEvent.click(dialogScope.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(deleteMutateAsyncMock).toHaveBeenCalledWith('league-123');
      expect(pushMock).toHaveBeenCalledWith('/leagues');
    });
  });
});
