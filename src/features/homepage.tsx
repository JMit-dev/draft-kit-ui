'use client';

import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import FeatureCard from './home/components/FeatureCard';
import Navbar from './home/components/Navbar';

const features = [
  {
    title: 'Draft Board',
    description: 'View and manage the live draft board in real time.',
    buttonText: 'Go to Draft',
  },
  {
    title: 'Injury Report',
    description: 'Browse current injury status of all players',
    buttonText: 'View Reports',
  },
  {
    title: 'My Team',
    description: 'Track your roster and category strengths.',
    buttonText: 'View Team',
  },
  {
    title: 'Depth Charts',
    description: 'View full depth charts across MLB',
    buttonText: 'View Depth Charts',
  },
  {
    title: 'League Setup',
    description: 'Configure league settings and scoring format.',
    buttonText: 'Setup League',
  },
  {
    title: 'Player Stats',
    description: 'View all player stats from previous seasons',
    buttonText: 'View Stats',
  },
];

export default function HomePage() {
  return (
    <Box>
      <Navbar />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
