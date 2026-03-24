import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import UpsertLeagueModal from './UpsertLeagueModal';
import type { League } from '../types/leagues.types';

const mutateAsyncMock = vi.fn();

vi.mock('../hooks/useUpsertLeague', () => ({
  useUpsertLeague: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
    isError: false,
    reset: vi.fn(),
  }),
}));

function renderModal(initialLeague?: League) {
  render(
    <ChakraProvider>
      <UpsertLeagueModal
        isOpen={true}
        onClose={vi.fn()}
        initialLeague={initialLeague}
      />
    </ChakraProvider>,
  );
}

describe('UpsertLeagueModal', () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset();
  });

  it('submits update with existing league context', async () => {
    mutateAsyncMock.mockResolvedValue({});

    const initialLeague: League = {
      _id: 'league-123',
      externalId: 'custom-league-123',
      name: 'Old Name',
      teams: 10,
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
    };

    renderModal(initialLeague);

    expect(screen.getByRole('dialog', { name: /edit league/i })).toBeTruthy();

    const nameInput = screen.getByLabelText(/league name/i);
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
    });

    const args = mutateAsyncMock.mock.calls[0][0];
    expect(args.existingLeague).toEqual(initialLeague);
    expect(args.input.name).toBe('New Name');
    expect(args.input.teams).toBe(10);
    expect(args.input.draftType).toBe('auction');
  });
});
