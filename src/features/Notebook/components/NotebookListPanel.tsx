'use client';

import { Box, Button, Flex, Heading, VStack } from '@chakra-ui/react';
import NotebookListItem from './NotebookListItem';

type Notebook = {
  id: number;
  name: string;
};

type NotebookListPanelProps = {
  notebooks: Notebook[];
  selectedNotebookId: number | null;
  onAddNotebook: () => void;
  onRenameNotebook: (id: number, name: string) => void;
  onOpenNotebook: (id: number) => void;
};

export default function NotebookListPanel({
  notebooks,
  selectedNotebookId,
  onAddNotebook,
  onRenameNotebook,
  onOpenNotebook,
}: NotebookListPanelProps) {
  return (
    <Box flex="1">
      <Flex mb={6} align="center" justify="space-between">
        <Heading>Notebooks per game</Heading>
        <Button
          bg="green.600"
          color="white"
          _hover={{ bg: 'green.700' }}
          onClick={onAddNotebook}
        >
          +
        </Button>
      </Flex>

      <VStack align="stretch" spacing={5}>
        {notebooks.map((notebook) => (
          <NotebookListItem
            key={notebook.id}
            notebook={notebook}
            isSelected={notebook.id === selectedNotebookId}
            onRename={onRenameNotebook}
            onOpen={onOpenNotebook}
          />
        ))}
      </VStack>
    </Box>
  );
}
