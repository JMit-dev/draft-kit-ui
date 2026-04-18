import { backendClient } from '@/shared/utils/api-client';
import { LeaguesResponse } from '../types/leagues.types';

export async function fetchLeagues(): Promise<LeaguesResponse> {
  return backendClient.get<LeaguesResponse>('/api/leagues');
}
