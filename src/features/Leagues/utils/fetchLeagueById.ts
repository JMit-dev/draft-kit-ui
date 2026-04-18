import { backendClient } from '@/shared/utils/api-client';
import type { LeagueResponse } from '../types/leagues.types';

export async function fetchLeagueById(id: string): Promise<LeagueResponse> {
  return backendClient.get<LeagueResponse>(`/api/leagues/${id}`);
}
