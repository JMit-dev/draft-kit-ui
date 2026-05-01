'use client';

import { useCallback, useMemo, useState } from 'react';
import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react';
import type {
  League,
  TakenPlayer,
} from '@/features/Leagues/types/leagues.types';
import LeagueTeamTable from '@/features/Leagues/components/LeagueTeamTable';

type TeamRow = { rowId: string; playerId: string; price: number };

type Props = {
  league: League | null;
  onSaveRosters: (updatedTakenPlayers: TakenPlayer[]) => void;
  isSavingRosters?: boolean;
};

export default function DraftRightPanel({
  league,
  onSaveRosters,
  isSavingRosters = false,
}: Props) {
  const [dirtyTeamIds, setDirtyTeamIds] = useState<Set<string>>(new Set());
  const [currentRowsByTeam, setCurrentRowsByTeam] = useState<
    Record<string, TeamRow[]>
  >({});

  const handleDirtyChange = useCallback((teamId: string, isDirty: boolean) => {
    setDirtyTeamIds((prev) => {
      const next = new Set(prev);
      if (isDirty) next.add(teamId);
      else next.delete(teamId);
      return next;
    });
  }, []);

  const handleRowsChange = useCallback((teamId: string, rows: TeamRow[]) => {
    setCurrentRowsByTeam((prev) => {
      const existing = prev[teamId];
      if (
        existing &&
        existing.length === rows.length &&
        existing.every(
          (r, i) =>
            r.rowId === rows[i].rowId &&
            r.playerId === rows[i].playerId &&
            r.price === rows[i].price,
        )
      ) {
        return prev;
      }
      return { ...prev, [teamId]: rows };
    });
  }, []);

  const teams = league?.teams ?? [];
  const takenPlayers = league?.taken_players ?? [];

  const takenPlayersByTeam = useMemo(() => {
    const map: Record<string, TakenPlayer[]> = {};
    for (const [teamId] of teams) {
      map[teamId] = takenPlayers.filter(([, tid]) => tid === teamId);
    }
    return map;
  }, [teams, takenPlayers]);

  function handleSave() {
    if (!league) return;

    const existingTakenPlayers = league.taken_players ?? [];
    const newTakenPlayers: TakenPlayer[] = [];

    for (const [teamId] of league.teams ?? []) {
      const rows = currentRowsByTeam[teamId];

      if (!rows) {
        // Table not yet initialized — preserve original entries for this team
        existingTakenPlayers
          .filter(([, tid]) => tid === teamId)
          .forEach((entry) => newTakenPlayers.push(entry));
        continue;
      }

      for (const row of rows) {
        if (!row.playerId) continue;

        const existing = existingTakenPlayers.find(
          ([pid, tid]) => pid === row.playerId && tid === teamId,
        );

        if (existing && existing.length === 5) {
          newTakenPlayers.push([
            row.playerId,
            teamId,
            row.rowId,
            row.price,
            existing[4],
          ]);
        } else {
          newTakenPlayers.push([row.playerId, teamId, row.rowId, row.price]);
        }
      }
    }

    // Preserve any entries whose player wasn't captured in the table rows
    // (e.g. UNSLOTTED entries with a position slot not matching any row ID)
    const processedPairs = new Set(
      newTakenPlayers.map(([pid, tid]) => `${pid}|${tid}`),
    );
    for (const entry of existingTakenPlayers) {
      const [pid, tid] = entry;
      if (!processedPairs.has(`${pid}|${tid}`)) {
        newTakenPlayers.push(entry);
      }
    }

    onSaveRosters(newTakenPlayers);
  }

  const hasDirtyChanges = dirtyTeamIds.size > 0;

  if (!league) {
    return (
      <Box p={4} color="gray.400" fontSize="sm">
        Select a league to view teams.
      </Box>
    );
  }

  return (
    <Flex direction="column" h="100%">
      <Box flex="9" overflowY="auto">
        <Stack spacing={4} p={4}>
          {teams.map((team) => {
            const [teamId] = team;
            return (
              <LeagueTeamTable
                key={teamId}
                team={team}
                rosterSlots={league.rosterSlots}
                allTakenPlayers={takenPlayers}
                takenPlayers={takenPlayersByTeam[teamId] ?? []}
                startingBudget={league.totalBudget ?? 0}
                minorLeagueSlots={league.minorLeagueSlotsPerTeam ?? 0}
                onDirtyChange={handleDirtyChange}
                onRowsChange={handleRowsChange}
                isSaving={isSavingRosters}
                draftMode
              />
            );
          })}
          {teams.length === 0 && (
            <Text color="gray.400" fontSize="sm">
              No teams found in this league.
            </Text>
          )}
        </Stack>
      </Box>

      <Flex
        flex="1"
        borderTopWidth="1px"
        borderColor="gray.200"
        p={4}
        align="center"
      >
        <Button
          size="sm"
          colorScheme="blue"
          onClick={handleSave}
          isDisabled={!hasDirtyChanges || isSavingRosters}
          isLoading={isSavingRosters}
        >
          Save Changes
        </Button>
      </Flex>
    </Flex>
  );
}
