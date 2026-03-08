import { League } from '../types/leagues.types';
interface LeaguesResponse {
  success: boolean;
  data: League[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchLeagues(): Promise<LeaguesResponse> {
  const res = await fetch(`${API_URL}/api/leagues`);
  if (!res.ok) throw new Error('Failed to fetch leagues');

  return res.json();
}
