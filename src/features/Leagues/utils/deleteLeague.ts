import { backendClient } from '@/shared/utils/api-client';
import type { LeagueResponse } from '../types/leagues.types';

export async function deleteLeague(id: string): Promise<LeagueResponse> {
  return backendClient.delete<LeagueResponse>(`/api/leagues/${id}`);
}
