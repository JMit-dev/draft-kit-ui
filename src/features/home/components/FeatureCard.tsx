'use client';

import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import CardButton from '@/shared/components/ui/CardButton';

type FeatureCardProps = {
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
};

export default function FeatureCard({
  title,
  description,
  buttonText,
  onClick,
}: FeatureCardProps) {
  return (
    <Box
      p={8}
      m={8}
      borderWidth="1px"
      borderRadius="xl"
      boxShadow="md"
      minH="200px"
      _hover={{ boxShadow: 'xl' }}
      transition="0.2s"
    >
      <VStack align="start" spacing={4} h="100%" justify="space-between">
        <div>
          <Heading size="md">{title}</Heading>
          <Text color="gray.600" mt={2}>
            {description}
          </Text>
        </div>

        <CardButton label={buttonText}></CardButton>
      </VStack>
    </Box>
  );
}
