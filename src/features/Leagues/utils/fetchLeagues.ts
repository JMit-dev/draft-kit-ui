import { League } from '../types/leagues.types';

export async function fetchLeagues(): Promise<League[]> {
  const res = await fetch('http://localhost:3001/api/leagues');

  if (!res.ok) {
    throw new Error('Failed to fetch leagues');
  }

  return res.json();
}
