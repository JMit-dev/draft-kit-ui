'use client';

import { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import NotebookListPanel from './components/NotebookListPanel';
import NotebookWorkspace from './components/NotebookWorkspace';

export default function NotebookPage() {
  const [notebooks, setNotebooks] = useState<
    Array<{ id: number; name: string; content: string }>
  >([]);
  const [selectedNotebookId, setSelectedNotebookId] = useState<number | null>(
    null,
  );
  const [playerNotes, setPlayerNotes] = useState<Record<string, string>>({});
  const [selectedPlayerName, setSelectedPlayerName] = useState<string | null>(
    null,
  );

  const addNotebook = () => {
    const newNotebook = {
      id: Date.now(),
      name: 'New Notebook',
      content: '',
    };

    setNotebooks((current) => [...current, newNotebook]);
    setSelectedPlayerName(null);
    setSelectedNotebookId(newNotebook.id);
  };

  const renameNotebook = (id: number, name: string) => {
    setNotebooks((current) =>
      current.map((notebook) =>
        notebook.id === id ? { ...notebook, name } : notebook,
      ),
    );
  };

  const updateNotebookContent = (id: number, content: string) => {
    setNotebooks((current) =>
      current.map((notebook) =>
        notebook.id === id ? { ...notebook, content } : notebook,
      ),
    );
  };

  const updatePlayerContent = (playerName: string, content: string) => {
    setPlayerNotes((current) => ({
      ...current,
      [playerName]: content,
    }));
  };

  const openPlayerNotebook = (playerName: string) => {
    setSelectedNotebookId(null);
    setSelectedPlayerName(playerName);
  };

  const selectedNotebook =
    notebooks.find((notebook) => notebook.id === selectedNotebookId) ?? null;
  const selectedItemName = selectedPlayerName ?? selectedNotebook?.name ?? null;
  const selectedItemContent = selectedPlayerName
    ? (playerNotes[selectedPlayerName] ?? '')
    : (selectedNotebook?.content ?? '');

  return (
    <Box p={8}>
      <Flex gap={8} align="stretch" minH="calc(100vh - 140px)">
        <NotebookWorkspace
          selectedNotebookId={selectedNotebook?.id ?? null}
          selectedNotebookName={selectedItemName}
          selectedNotebookContent={selectedItemContent}
          onNotebookContentChange={updateNotebookContent}
          onPlayerContentChange={updatePlayerContent}
          selectedPlayerName={selectedPlayerName}
          onCloseNotebook={() => {
            setSelectedNotebookId(null);
            setSelectedPlayerName(null);
          }}
          onOpenPlayerNotebook={openPlayerNotebook}
        />
        <NotebookListPanel
          notebooks={notebooks}
          selectedNotebookId={selectedNotebookId}
          onAddNotebook={addNotebook}
          onRenameNotebook={renameNotebook}
          onOpenNotebook={(id) => {
            setSelectedPlayerName(null);
            setSelectedNotebookId(id);
          }}
        />
      </Flex>
    </Box>
  );
}
