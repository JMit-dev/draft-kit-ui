'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
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

type LeagueTeamTableProps = {
  team: LeagueTeam;
  rosterSlots?: RosterSlots;
  takenPlayers?: TakenPlayer[];
  startingBudget: number;
  onSaveChanges?: (payload: {
    teamName: string;
    rows: Array<{
      rowId: string;
      playerName: string;
      price: number;
    }>;
  }) => void;
  isSaving?: boolean;
};

type TeamTableRow = {
  rowId: string;
  position: string;
  playerName: string;
  price: string;
};

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
        playerName: player?.[0] ?? '',
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

  useEffect(() => {
    setLocalTeamName(teamName);
    setLocalRows(propRows);
  }, [propRows, teamName]);

  const rows = localRows;
  const currentBudget = calculateCurrentBudgetFromRows(startingBudget, rows);
  const isDirty =
    localTeamName !== teamName ||
    rows.some((row, index) => row.price !== propRows[index]?.price);

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

  function handleSaveChanges() {
    onSaveChanges?.({
      teamName: localTeamName.trim() || teamName,
      rows: rows.map((row) => ({
        rowId: row.rowId,
        playerName: row.playerName,
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
            {rows.map((row) => (
              <Tr key={row.rowId}>
                <Td>{row.position}</Td>
                <Td>{row.playerName || '-'}</Td>
                <Td isNumeric>
                  <Input
                    type="number"
                    min={0}
                    max={startingBudget}
                    value={row.price}
                    onChange={(e) => {
                      const rowIndex = rows.findIndex(
                        (candidate) => candidate.rowId === row.rowId,
                      );
                      if (rowIndex < 0) return;

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
