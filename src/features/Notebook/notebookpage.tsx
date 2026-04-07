'use client';

import { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import NotebookListPanel from './components/NotebookListPanel';
import NotebookWorkspace from './components/NotebookWorkspace';

export default function NotebookPage() {
  const [notebooks, setNotebooks] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [selectedNotebookId, setSelectedNotebookId] = useState<number | null>(
    null,
  );

  const addNotebook = () => {
    const newNotebook = { id: Date.now(), name: 'New Notebook' };

    setNotebooks((current) => [...current, newNotebook]);
    setSelectedNotebookId(newNotebook.id);
  };

  const renameNotebook = (id: number, name: string) => {
    setNotebooks((current) =>
      current.map((notebook) =>
        notebook.id === id ? { ...notebook, name } : notebook,
      ),
    );
  };

  const selectedNotebook =
    notebooks.find((notebook) => notebook.id === selectedNotebookId) ?? null;

  return (
    <Box p={8}>
      <Flex gap={8} align="stretch" minH="calc(100vh - 140px)">
        <NotebookWorkspace
          selectedNotebookName={selectedNotebook?.name ?? null}
          onCloseNotebook={() => setSelectedNotebookId(null)}
        />
        <NotebookListPanel
          notebooks={notebooks}
          selectedNotebookId={selectedNotebookId}
          onAddNotebook={addNotebook}
          onRenameNotebook={renameNotebook}
          onOpenNotebook={setSelectedNotebookId}
        />
      </Flex>
    </Box>
  );
}
