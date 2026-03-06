import { useQuery } from '@tanstack/react-query';
import { fetchLeagues } from '../utils/fetchLeagues';
export function useLeagues() {
  return useQuery({
    queryKey: ['leagues'],
    queryFn: fetchLeagues,
  });
}
