import { Heading, Box } from '@chakra-ui/react';
import LeagueList from './components/LeagueList';

export default function LeaguesPage() {
  return (
    <Box p={8}>
      <Heading mb={6}>My Leagues</Heading>
      <LeagueList />
    </Box>
  );
}
