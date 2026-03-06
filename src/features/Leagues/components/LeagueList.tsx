'use client';

import { VStack, Spinner, Text } from '@chakra-ui/react';
import { useLeagues } from '../hooks/useLeagues';

export default function LeagueList() {
  const { data, isLoading, error } = useLeagues();

  if (isLoading) return <Spinner />;

  if (error) return <Text>Error loading leagues</Text>;
  console.log('Fetched leagues:', data);
  return (
    <VStack spacing={4}>
      {data?.data?.map((league) => (
        <Text key={league.id}>{league.name}</Text>
      ))}
    </VStack>
  );
}
