'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import type {
  LeagueTeam,
  RosterSlots,
  TakenPlayer,
} from '../types/leagues.types';
import { DEFAULT_ROSTER_SLOTS, ROSTER_POSITIONS } from '../utils/leagueForm';
import { apiClient } from '@/shared/utils/api-client';

type LeagueTeamTableProps = {
  team: LeagueTeam;
  rosterSlots?: RosterSlots;
  takenPlayers?: TakenPlayer[];
  startingBudget: number;
  onSaveChanges?: (payload: {
    teamName: string;
    rows: Array<{
      rowId: string;
      playerId: string;
      price: number;
    }>;
  }) => void;
  isSaving?: boolean;
};

type TeamTableRow = {
  rowId: string;
  position: string;
  playerId: string;
  price: string;
};

type Player = {
  _id: string;
  name: string;
  positions: string[];
  playerType: 'hitter' | 'pitcher';
};

type PlayersResponse = {
  data?: Player[];
  pagination?: {
    totalPages?: number;
  };
};

function isPlayerAllowedForRow(player: Player, position: string) {
  if (position === 'BENCH') return true;
  if (position === 'UTIL') return player.playerType === 'hitter';
  return player.positions.includes(position);
}

function buildTeamRows(
  rosterSlots: RosterSlots,
  takenPlayers: TakenPlayer[],
): TeamTableRow[] {
  return ROSTER_POSITIONS.flatMap((position) =>
    Array.from({ length: rosterSlots[position] }, (_, slotIndex) => {
      const rowId = `${position}-${slotIndex}`;
      const player = takenPlayers.find(
        ([, , positionSlot]) => positionSlot === rowId,
      );

      return {
        rowId,
        position,
        playerId: player?.[0] ?? '',
        price: String(player?.[3] ?? 0),
      };
    }),
  );
}

function parsePrice(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function calculateCurrentBudgetFromRows(
  startingBudget: number,
  rows: TeamTableRow[],
): number {
  const spent = rows.reduce((sum, row) => sum + parsePrice(row.price), 0);
  return Math.max(0, startingBudget - spent);
}

export default function LeagueTeamTable({
  team,
  rosterSlots = DEFAULT_ROSTER_SLOTS,
  takenPlayers = [],
  startingBudget,
  onSaveChanges,
  isSaving = false,
}: LeagueTeamTableProps) {
  const [, teamName] = team;
  const propRows = useMemo(
    () => buildTeamRows(rosterSlots, takenPlayers),
    [rosterSlots, takenPlayers],
  );
  const [localTeamName, setLocalTeamName] = useState(teamName);
  const [localRows, setLocalRows] = useState(propRows);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);

  useEffect(() => {
    setLocalTeamName(teamName);
    setLocalRows(propRows);
  }, [propRows, teamName]);

  useEffect(() => {
    let active = true;

    async function loadPlayers() {
      try {
        setIsLoadingPlayers(true);

        const firstPage = await apiClient.get<PlayersResponse>('/api/players', {
          params: { limit: 100, page: 1 },
        });
        const firstBatch = firstPage.data ?? [];
        const totalPages = firstPage.pagination?.totalPages ?? 1;
        const pageRequests: Promise<PlayersResponse>[] = [];

        for (let page = 2; page <= totalPages; page += 1) {
          pageRequests.push(
            apiClient.get<PlayersResponse>('/api/players', {
              params: { limit: 100, page },
            }),
          );
        }

        const remainingPages = await Promise.all(pageRequests);
        const allPlayers = [
          ...firstBatch,
          ...remainingPages.flatMap((page) => page.data ?? []),
        ];

        if (!active) return;
        setPlayers(allPlayers);
      } catch {
        if (active) {
          setPlayers([]);
        }
      } finally {
        if (active) {
          setIsLoadingPlayers(false);
        }
      }
    }

    loadPlayers();

    return () => {
      active = false;
    };
  }, []);

  const rows = localRows;
  const currentBudget = calculateCurrentBudgetFromRows(startingBudget, rows);
  const isDirty =
    localTeamName !== teamName ||
    rows.some(
      (row, index) =>
        row.price !== propRows[index]?.price ||
        row.playerId !== propRows[index]?.playerId,
    );

  function handleLocalPriceChange(rowIndex: number, value: string) {
    if (value !== '' && !/^\d+$/.test(value)) return;

    setLocalRows((prev) => {
      const parsedValue = value === '' ? 0 : parsePrice(value);
      const spentWithoutRow = prev.reduce((sum, row, index) => {
        if (index === rowIndex) return sum;
        return sum + parsePrice(row.price);
      }, 0);
      const maxAllowed = Math.max(0, startingBudget - spentWithoutRow);

      if (parsedValue > maxAllowed) return prev;

      return prev.map((row, index) =>
        index === rowIndex ? { ...row, price: value } : row,
      );
    });
  }

  function handlePlayerSelectionChange(rowIndex: number, value: string) {
    setLocalRows((prev) =>
      prev.map((row, index) =>
        index === rowIndex ? { ...row, playerId: value } : row,
      ),
    );
  }

  function handleSaveChanges() {
    onSaveChanges?.({
      teamName: localTeamName.trim() || teamName,
      rows: rows.map((row) => ({
        rowId: row.rowId,
        playerId: row.playerId,
        price: parsePrice(row.price),
      })),
    });
  }

  return (
    <Box
      w="100%"
      minW="0"
      maxW="100%"
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      bg="white"
    >
      <Flex
        align={{ base: 'flex-start', md: 'center' }}
        justify="space-between"
        direction={{ base: 'column', md: 'row' }}
        gap={2}
        px={4}
        py={3}
        bg="gray.50"
        borderBottomWidth="1px"
      >
        <Input
          value={localTeamName}
          onChange={(e) => setLocalTeamName(e.target.value)}
          size="sm"
          maxW="180px"
          fontWeight="bold"
          bg="white"
          isDisabled={isSaving}
        />
        <Text fontWeight="semibold" color="gray.700">
          Budget: ${currentBudget}
        </Text>
      </Flex>

      <TableContainer w="auto">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Position</Th>
              <Th>Player</Th>
              <Th isNumeric>Price</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row, rowIndex) => (
              <Tr key={row.rowId}>
                <Td>{row.position}</Td>
                <Td>
                  <Select
                    value={row.playerId}
                    onChange={(e) =>
                      handlePlayerSelectionChange(rowIndex, e.target.value)
                    }
                    size="sm"
                    bg="white"
                    placeholder={
                      isLoadingPlayers ? 'Loading players...' : 'Select player'
                    }
                    isDisabled={isSaving || isLoadingPlayers}
                  >
                    {!isLoadingPlayers && players.length === 0 ? (
                      <option value="" disabled>
                        No players available
                      </option>
                    ) : null}
                    {players
                      .filter((player) =>
                        isPlayerAllowedForRow(player, row.position),
                      )
                      .map((player) => (
                        <option key={player._id} value={player._id}>
                          {player.name}
                        </option>
                      ))}
                  </Select>
                </Td>
                <Td isNumeric>
                  <Input
                    type="number"
                    min={0}
                    max={startingBudget}
                    value={row.price}
                    onChange={(e) => {
                      handleLocalPriceChange(rowIndex, e.target.value);
                    }}
                    textAlign="right"
                    size="sm"
                    width="88px"
                    marginLeft="auto"
                    isDisabled={isSaving}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {onSaveChanges ? (
        <Box px={4} py={3} borderTopWidth="1px" bg="gray.50">
          <Button
            size="sm"
            colorScheme="blue"
            onClick={handleSaveChanges}
            isLoading={isSaving}
            isDisabled={!isDirty}
          >
            Save Changes
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}
