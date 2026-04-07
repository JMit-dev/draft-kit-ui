'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { apiClient } from '@/shared/utils/api-client';

type Player = {
  _id: string;
  name: string;
  team: string;
  positions: string[];
  injuryStatus: string;
};

type PlayersResponse = {
  data?: Player[];
};

type TopPlayersPanelProps = {
  onOpenPlayer: (playerName: string) => void;
};

export default function TopPlayersPanel({
  onOpenPlayer,
}: TopPlayersPanelProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [playersError, setPlayersError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPlayers() {
      try {
        setIsLoadingPlayers(true);
        setPlayersError(null);

        const response = await apiClient.get<PlayersResponse>('/api/players', {
          params: { limit: 4, page: 1 },
        });

        if (!active) {
          return;
        }

        setPlayers(response.data?.slice(0, 4) ?? []);
      } catch {
        if (active) {
          setPlayersError('Unable to load players');
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

  return (
    <Box>
      <Heading as="h2" size="md" mb={4}>
        Top Players
      </Heading>

      {isLoadingPlayers ? (
        <Flex justify="center" py={4}>
          <Spinner size="sm" />
        </Flex>
      ) : null}

      {playersError ? (
        <Text color="red.500" fontSize="sm">
          {playersError}
        </Text>
      ) : null}

      {!isLoadingPlayers && !playersError ? (
        <VStack align="stretch" spacing={3}>
          {players.map((player, index) => (
            <Box
              key={player._id}
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="white"
              px={4}
              py={3}
              boxShadow="sm"
              cursor="pointer"
              _hover={{ borderColor: 'green.400', boxShadow: 'md' }}
              transition="all 0.15s ease"
              onClick={() => onOpenPlayer(player.name)}
            >
              <Flex align="center" justify="space-between" gap={3}>
                <Text fontSize="sm" fontWeight="bold" color="gray.500">
                  #{index + 1}
                </Text>
                <Badge
                  colorScheme={
                    player.injuryStatus === 'active' ? 'green' : 'red'
                  }
                  textTransform="capitalize"
                >
                  {player.injuryStatus}
                </Badge>
              </Flex>

              <Text mt={2} fontWeight="semibold" color="gray.800">
                {player.name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {player.team}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {player.positions.join(', ') || 'No position'}
              </Text>
            </Box>
          ))}
        </VStack>
      ) : null}
    </Box>
  );
}
