import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import RankingsTable from './RankingsTable';

const fetchMock = vi.fn();

// Last-name alphabetical order: Freeman, Judge, Ramirez, Trout
const PLAYERS = [
  {
    _id: 'p1',
    name: 'Aaron Judge',
    team: 'NYY',
    positions: ['OF'],
    playerType: 'hitter',
    league: 'MLB',
    injuryStatus: 'active',
    active: true,
  },
  {
    _id: 'p2',
    name: 'Freddie Freeman',
    team: 'LAD',
    positions: ['1B'],
    playerType: 'hitter',
    league: 'MLB',
    injuryStatus: 'active',
    active: true,
  },
  {
    _id: 'p3',
    name: 'Mike Trout',
    team: 'LAA',
    positions: ['OF'],
    playerType: 'hitter',
    league: 'MLB',
    injuryStatus: 'active',
    active: true,
  },
  {
    _id: 'p4',
    name: 'Jose Ramirez',
    team: 'CLE',
    positions: ['3B'],
    playerType: 'hitter',
    league: 'MLB',
    injuryStatus: 'active',
    active: true,
  },
];

async function renderAndWait(onPlayerClick = vi.fn()) {
  render(
    <ChakraProvider>
      <RankingsTable onPlayerClick={onPlayerClick} />
    </ChakraProvider>,
  );
  await screen.findByText('Freddie Freeman', undefined, { timeout: 3000 });
}

describe('RankingsTable', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        data: PLAYERS,
        pagination: { totalPages: 1 },
      }),
    });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('initial load order', () => {
    it('displays players sorted alphabetically by last name', async () => {
      await renderAndWait();
      // Name is the 2nd column; Rank is 1st
      // Expected order: Freeman(1), Judge(2), Ramirez(3), Trout(4)
      const rows = screen.getAllByRole('row').slice(1); // skip header
      expect(within(rows[0]).getByText('Freddie Freeman')).toBeTruthy();
      expect(within(rows[3]).getByText('Mike Trout')).toBeTruthy();
    });
  });

  describe('position filtering', () => {
    it('shows all players when no position filter is active', async () => {
      await renderAndWait();
      expect(screen.getByText('Aaron Judge')).toBeTruthy();
      expect(screen.getByText('Freddie Freeman')).toBeTruthy();
      expect(screen.getByText('Mike Trout')).toBeTruthy();
      expect(screen.getByText('Jose Ramirez')).toBeTruthy();
    });

    it('shows only matching players when a single position is selected', async () => {
      await renderAndWait();
      fireEvent.click(screen.getByRole('button', { name: 'OF' }));
      await waitFor(() => {
        expect(screen.getByText('Aaron Judge')).toBeTruthy();
        expect(screen.getByText('Mike Trout')).toBeTruthy();
        expect(screen.queryByText('Freddie Freeman')).toBeNull();
        expect(screen.queryByText('Jose Ramirez')).toBeNull();
      });
    });

    it('shows players matching any selected position when multiple are active', async () => {
      await renderAndWait();
      fireEvent.click(screen.getByRole('button', { name: 'OF' }));
      fireEvent.click(screen.getByRole('button', { name: '1B' }));
      await waitFor(() => {
        expect(screen.getByText('Aaron Judge')).toBeTruthy();
        expect(screen.getByText('Freddie Freeman')).toBeTruthy();
        expect(screen.getByText('Mike Trout')).toBeTruthy();
        expect(screen.queryByText('Jose Ramirez')).toBeNull();
      });
    });

    it('deselects a position when clicked again and restores hidden players', async () => {
      await renderAndWait();
      fireEvent.click(screen.getByRole('button', { name: 'OF' }));
      await waitFor(() =>
        expect(screen.queryByText('Freddie Freeman')).toBeNull(),
      );
      fireEvent.click(screen.getByRole('button', { name: 'OF' }));
      await waitFor(() =>
        expect(screen.getByText('Freddie Freeman')).toBeTruthy(),
      );
    });

    it('All button clears all active position selections and shows every player', async () => {
      await renderAndWait();
      fireEvent.click(screen.getByRole('button', { name: 'OF' }));
      fireEvent.click(screen.getByRole('button', { name: 'All' }));
      await waitFor(() => {
        expect(screen.getByText('Freddie Freeman')).toBeTruthy();
        expect(screen.getByText('Jose Ramirez')).toBeTruthy();
      });
    });
  });

  describe('row click', () => {
    it('calls onPlayerClick with the clicked player when a row is clicked', async () => {
      const onPlayerClick = vi.fn();
      await renderAndWait(onPlayerClick);

      // First row after load is Freeman (alphabetically first by last name)
      const rows = screen.getAllByRole('row').slice(1);
      fireEvent.click(rows[0]);

      expect(onPlayerClick).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Freddie Freeman' }),
      );
    });
  });
});
