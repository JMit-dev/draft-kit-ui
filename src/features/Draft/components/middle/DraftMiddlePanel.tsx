'use client';

import { Box, Flex, Input, Text } from '@chakra-ui/react';

export default function DraftMiddlePanel() {
  return (
    <Flex direction="column" h="100%">
      <Box flex="2" borderBottomWidth="1px" borderColor="gray.200" p={4}>
        <Text color="gray.400" fontSize="sm">
          Draft log table
        </Text>
      </Box>
      <Flex flex="1" direction="column" gap={3} p={4}>
        <Text color="gray.400" fontSize="sm">
          Users will query API using search bar
        </Text>
        <Input placeholder="Search..." size="sm" />
      </Flex>
    </Flex>
  );
}
