'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import type {
  CreateLeagueInput,
  League,
  RosterSlots,
} from '../types/leagues.types';
import { useUpsertLeague } from '../hooks/useUpsertLeague';
import {
  DEFAULT_ROSTER_SLOTS,
  parseTeamsFromDescription,
  ROSTER_POSITIONS,
} from '../utils/leagueForm';

type UpsertLeagueModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialLeague?: League;
};

export default function UpsertLeagueModal({
  isOpen,
  onClose,
  initialLeague,
}: UpsertLeagueModalProps) {
  const upsertLeagueMutation = useUpsertLeague();

  type LeagueForm = {
    leagueName: string;
    teams: string;
    totalBudget: string;
    draftType: 'auction';
    rosterSlots: Record<keyof RosterSlots, string>;
  };

  const DEFAULT_FORM: LeagueForm = useMemo(() => {
    const teams =
      initialLeague?.teams?.length ??
      parseTeamsFromDescription(initialLeague?.description) ??
      12;

    return {
      leagueName: initialLeague?.name ?? '',
      teams: String(teams),
      totalBudget: String(initialLeague?.totalBudget ?? 260),
      draftType: 'auction',
      rosterSlots: ROSTER_POSITIONS.reduce(
        (acc, position) => {
          const value =
            initialLeague?.rosterSlots?.[position] ??
            DEFAULT_ROSTER_SLOTS[position];
          acc[position] = String(value);
          return acc;
        },
        {} as Record<keyof RosterSlots, string>,
      ),
    };
  }, [initialLeague]);

  const [form, setForm] = useState<LeagueForm>(DEFAULT_FORM);

  useEffect(() => {
    if (!isOpen) return;
    setForm(DEFAULT_FORM);
  }, [DEFAULT_FORM, isOpen]);

  const canSubmit = useMemo(() => {
    const parsedTeams = Number.parseInt(form.teams, 10);
    const parsedTotalBudget = Number.parseInt(form.totalBudget, 10);

    return (
      form.leagueName.trim().length > 0 &&
      !Number.isNaN(parsedTeams) &&
      parsedTeams > 1 &&
      !Number.isNaN(parsedTotalBudget) &&
      parsedTotalBudget >= 0
    );
  }, [form.leagueName, form.teams, form.totalBudget]);

  function handleRosterSlotChange(position: keyof RosterSlots, value: string) {
    // Allow users to freely edit (including empty), without snapping values.
    if (value !== '' && !/^\d+$/.test(value)) return;
    setForm((prev) => ({
      ...prev,
      rosterSlots: {
        ...prev.rosterSlots,
        [position]: value,
      },
    }));
  }

  function resetForm() {
    setForm(DEFAULT_FORM);
  }

  function handleClose() {
    upsertLeagueMutation.reset();
    resetForm();
    onClose();
  }

  async function handleSubmit() {
    if (!canSubmit) return;

    const parsedTeams = Number.parseInt(form.teams, 10);
    const parsedTotalBudget = Number.parseInt(form.totalBudget, 10);
    if (Number.isNaN(parsedTeams) || Number.isNaN(parsedTotalBudget)) return;

    const rosterSlots = ROSTER_POSITIONS.reduce((acc, position) => {
      const raw = form.rosterSlots[position];
      const parsed = Number.parseInt(raw, 10);
      acc[position] = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
      return acc;
    }, {} as RosterSlots);

    const payload: CreateLeagueInput = {
      name: form.leagueName.trim(),
      teams: Math.max(2, parsedTeams),
      draftType: form.draftType,
      rosterSlots,
      totalBudget: Math.max(0, parsedTotalBudget),
    };

    try {
      await upsertLeagueMutation.mutateAsync({
        input: payload,
        existingLeague: initialLeague,
      });
      resetForm();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {initialLeague ? 'Edit League' : 'Create League'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel htmlFor="leagueName">League Name</FormLabel>
              <Input
                id="leagueName"
                placeholder="Enter league name"
                value={form.leagueName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, leagueName: e.target.value }))
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="teams"># of Teams</FormLabel>
              <Input
                id="teams"
                type="number"
                min={2}
                value={form.teams}
                onChange={(e) => {
                  const next = e.target.value;
                  if (next !== '' && !/^\d+$/.test(next)) return;
                  setForm((prev) => ({ ...prev, teams: next }));
                }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="draftType">Draft Type</FormLabel>
              <Select
                id="draftType"
                value={form.draftType}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    draftType: e.target.value as 'auction',
                  }))
                }
              >
                <option value="auction">Auction</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="totalBudget">Starting Budget ($)</FormLabel>
              <Input
                id="totalBudget"
                type="number"
                min={0}
                value={form.totalBudget}
                onChange={(e) => {
                  const next = e.target.value;
                  if (next !== '' && !/^\d+$/.test(next)) return;
                  setForm((prev) => ({ ...prev, totalBudget: next }));
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Roster Slots Per Position</FormLabel>
              <Grid templateColumns="repeat(2, minmax(0, 1fr))" gap={3}>
                {ROSTER_POSITIONS.map((position) => (
                  <GridItem key={position}>
                    <FormControl>
                      <FormLabel
                        fontSize="sm"
                        mb={1}
                        htmlFor={`roster-${position}`}
                      >
                        {position}
                      </FormLabel>
                      <Input
                        id={`roster-${position}`}
                        type="number"
                        min={0}
                        value={form.rosterSlots[position]}
                        onChange={(e) =>
                          handleRosterSlotChange(position, e.target.value)
                        }
                      />
                    </FormControl>
                  </GridItem>
                ))}
              </Grid>
            </FormControl>

            {upsertLeagueMutation.isError ? (
              <Text color="red.500" fontSize="sm">
                Failed to save league. Check API connection and API key.
              </Text>
            ) : null}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={!canSubmit}
            isLoading={upsertLeagueMutation.isPending}
          >
            {initialLeague ? 'Save Changes' : 'Create League'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
