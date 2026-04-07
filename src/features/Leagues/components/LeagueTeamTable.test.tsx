import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import LeagueTeamTable from './LeagueTeamTable';

describe('LeagueTeamTable', () => {
  it('renders the team name, calculated budget, and rows from roster slots', () => {
    render(
      <ChakraProvider>
        <LeagueTeamTable
          team={['team-1', 'Alpha', 999]}
          startingBudget={260}
          rosterSlots={{
            C: 1,
            '1B': 1,
            '2B': 0,
            '3B': 0,
            SS: 0,
            OF: 2,
            DH: 0,
            SP: 0,
            RP: 0,
            UTIL: 0,
            BENCH: 0,
          }}
          takenPlayers={[
            ['Adley Rutschman', 'team-1', 'C-0', 20],
            ['Freddie Freeman', 'team-1', '1B-0', 35],
            ['Julio Rodriguez', 'team-1', 'OF-0', 40],
          ]}
        />
      </ChakraProvider>,
    );

    expect(screen.getByDisplayValue('Alpha')).toBeTruthy();
    expect(screen.getByText('Budget: $165')).toBeTruthy();
    expect(screen.getByText('C')).toBeTruthy();
    expect(screen.getByText('1B')).toBeTruthy();
    expect(screen.getAllByText('OF')).toHaveLength(2);
    expect(screen.getByText('Adley Rutschman')).toBeTruthy();
    expect(screen.getByText('Freddie Freeman')).toBeTruthy();
    expect(screen.getByText('Julio Rodriguez')).toBeTruthy();
    expect(screen.getByDisplayValue('20')).toBeTruthy();
    expect(screen.getByDisplayValue('35')).toBeTruthy();
    expect(screen.getByDisplayValue('40')).toBeTruthy();
  });

  it('shows empty rows when there are fewer players than roster slots', () => {
    render(
      <ChakraProvider>
        <LeagueTeamTable
          team={['team-2', 'Beta', 0]}
          startingBudget={300}
          rosterSlots={{
            C: 1,
            '1B': 0,
            '2B': 0,
            '3B': 0,
            SS: 0,
            OF: 0,
            DH: 0,
            SP: 1,
            RP: 0,
            UTIL: 0,
            BENCH: 1,
          }}
          takenPlayers={[['William Contreras', 'team-2', 'C-0', 15]]}
        />
      </ChakraProvider>,
    );

    expect(screen.getByText('Budget: $285')).toBeTruthy();
    expect(screen.getByText('William Contreras')).toBeTruthy();
    expect(screen.getAllByText('-')).toHaveLength(2);
    expect(screen.getByDisplayValue('15')).toBeTruthy();
  });

  it('updates budget when a valid price is edited', () => {
    render(
      <ChakraProvider>
        <LeagueTeamTable
          team={['team-3', 'Gamma', 0]}
          startingBudget={100}
          rosterSlots={{
            C: 1,
            '1B': 1,
            '2B': 0,
            '3B': 0,
            SS: 0,
            OF: 0,
            DH: 0,
            SP: 0,
            RP: 0,
            UTIL: 0,
            BENCH: 0,
          }}
          takenPlayers={[
            ['Player A', 'team-3', 'C-0', 10],
            ['Player B', 'team-3', '1B-0', 20],
          ]}
        />
      </ChakraProvider>,
    );

    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: '25' } });

    expect(screen.getByText('Budget: $55')).toBeTruthy();
    expect(inputs[0]?.value).toBe('25');
  });

  it('does not allow a price above the team budget available for that slot', () => {
    render(
      <ChakraProvider>
        <LeagueTeamTable
          team={['team-4', 'Delta', 0]}
          startingBudget={100}
          rosterSlots={{
            C: 1,
            '1B': 1,
            '2B': 0,
            '3B': 0,
            SS: 0,
            OF: 0,
            DH: 0,
            SP: 0,
            RP: 0,
            UTIL: 0,
            BENCH: 0,
          }}
          takenPlayers={[
            ['Player A', 'team-4', 'C-0', 10],
            ['Player B', 'team-4', '1B-0', 20],
          ]}
        />
      </ChakraProvider>,
    );

    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: '90' } });

    expect(inputs[0]?.value).toBe('10');
    expect(screen.getByText('Budget: $70')).toBeTruthy();
  });

  it('calls through price handlers when provided', () => {
    const onSaveChanges = vi.fn();

    render(
      <ChakraProvider>
        <LeagueTeamTable
          team={['team-5', 'Echo', 0]}
          startingBudget={50}
          rosterSlots={{
            C: 1,
            '1B': 0,
            '2B': 0,
            '3B': 0,
            SS: 0,
            OF: 0,
            DH: 0,
            SP: 0,
            RP: 0,
            UTIL: 0,
            BENCH: 0,
          }}
          takenPlayers={[['Player A', 'team-5', 'C-0', 10]]}
          onSaveChanges={onSaveChanges}
        />
      </ChakraProvider>,
    );

    const input = screen.getByDisplayValue('10');
    fireEvent.change(input, { target: { value: '15' } });
    fireEvent.change(screen.getByDisplayValue('Echo'), {
      target: { value: 'Echo Updated' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(onSaveChanges).toHaveBeenCalledWith({
      teamName: 'Echo Updated',
      rows: [{ rowId: 'C-0', playerName: 'Player A', price: 15 }],
    });
  });

  it('keeps prices attached to their position slots instead of array order', () => {
    render(
      <ChakraProvider>
        <LeagueTeamTable
          team={['team-6', 'Foxtrot', 0]}
          startingBudget={260}
          rosterSlots={{
            C: 0,
            '1B': 1,
            '2B': 0,
            '3B': 0,
            SS: 0,
            OF: 1,
            DH: 0,
            SP: 0,
            RP: 0,
            UTIL: 0,
            BENCH: 0,
          }}
          takenPlayers={[
            ['Catcher Player', 'team-6', 'C-0', 100],
            ['First Base Player', 'team-6', '1B-0', 35],
            ['Outfielder', 'team-6', 'OF-0', 22],
          ]}
        />
      </ChakraProvider>,
    );

    expect(screen.getByText('First Base Player')).toBeTruthy();
    expect(screen.getByDisplayValue('35')).toBeTruthy();
    expect(screen.getByText('Outfielder')).toBeTruthy();
    expect(screen.getByDisplayValue('22')).toBeTruthy();
    expect(screen.queryByDisplayValue('100')).toBeNull();
  });
});
