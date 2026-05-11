'use client';

import { useState } from 'react';
import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
} from '@chakra-ui/react';
import type { LeagueTeam } from '@/features/Leagues/types/leagues.types';

type CompareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teams: LeagueTeam[];
  battingCategories: string[];
  pitchingCategories: string[];
};

export default function CompareModal({
  isOpen,
  onClose,
  teams,
  battingCategories,
  pitchingCategories,
}: CompareModalProps) {
  const [leftTeam, setLeftTeam] = useState('');
  const [rightTeam, setRightTeam] = useState('');
  const [category, setCategory] = useState<'Batting' | 'Pitching'>('Batting');

  const activeCategories =
    category === 'Batting' ? battingCategories : pitchingCategories;

  const teamOptions = teams.map(([id, name]) => (
    <option key={id} value={id}>
      {name}
    </option>
  ));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Compare</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Grid templateColumns="1fr 1fr 1fr" gap={6} mb={6}>
            <FormControl>
              <FormLabel>Team Select</FormLabel>
              <Select
                placeholder="Select team"
                value={leftTeam}
                onChange={(e) => setLeftTeam(e.target.value)}
              >
                {teamOptions}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as 'Batting' | 'Pitching')
                }
              >
                <option value="Batting">Batting</option>
                <option value="Pitching">Pitching</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Team Select</FormLabel>
              <Select
                placeholder="Select team"
                value={rightTeam}
                onChange={(e) => setRightTeam(e.target.value)}
              >
                {teamOptions}
              </Select>
            </FormControl>
          </Grid>

          <Divider mb={4} />

          <Grid templateColumns="1fr auto 1fr">
            {activeCategories.map((stat) => (
              <Box key={stat} display="contents">
                <GridItem
                  py={2}
                  px={4}
                  textAlign="right"
                  borderBottom="1px solid"
                  borderColor="chakra-border-color"
                >
                  <Text>—</Text>
                </GridItem>
                <GridItem
                  py={2}
                  px={6}
                  textAlign="center"
                  borderBottom="1px solid"
                  borderColor="chakra-border-color"
                >
                  <Text fontWeight="semibold">{stat}</Text>
                </GridItem>
                <GridItem
                  py={2}
                  px={4}
                  textAlign="left"
                  borderBottom="1px solid"
                  borderColor="chakra-border-color"
                >
                  <Text>—</Text>
                </GridItem>
              </Box>
            ))}
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
