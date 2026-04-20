'use client';

import { useEffect, useState } from 'react';
import { externalApiClient } from '@/shared/utils/api-client';
import type { Player, PlayersResponse } from '../types/notebook.types';

export function useTopPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [playersError, setPlayersError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPlayers() {
      try {
        setIsLoadingPlayers(true);
        setPlayersError(null);

        const firstPage = await externalApiClient.get<PlayersResponse>(
          '/api/players',
          {
            params: { limit: 100, page: 1 },
          },
        );
        const firstBatch = firstPage.data ?? [];
        const totalPages = firstPage.pagination?.totalPages ?? 1;
        const pageRequests: Promise<PlayersResponse>[] = [];

        for (let page = 2; page <= totalPages; page += 1) {
          pageRequests.push(
            externalApiClient.get<PlayersResponse>('/api/players', {
              params: { limit: 100, page },
            }),
          );
        }

        const remainingPages = await Promise.all(pageRequests);
        const allPlayers = [
          ...firstBatch,
          ...remainingPages.flatMap((page) => page.data ?? []),
        ];

        if (!active) {
          return;
        }

        setPlayers(allPlayers);
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

  return {
    players,
    isLoadingPlayers,
    playersError,
  };
}
