'use client';

import { useState } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';

type Notebook = {
  id: number;
  name: string;
};

type NotebookListItemProps = {
  notebook: Notebook;
  isSelected: boolean;
  onRename: (id: number, name: string) => void;
  onOpen: (id: number) => void;
};

export default function NotebookListItem({
  notebook,
  isSelected,
  onRename,
  onOpen,
}: NotebookListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(notebook.name);

  const commitRename = () => {
    const trimmedName = draftName.trim();
    onRename(notebook.id, trimmedName || notebook.name);
    setDraftName(trimmedName || notebook.name);
    setIsEditing(false);
  };

  return (
    <Box
      w="100%"
      minH="88px"
      px={6}
      borderRadius="md"
      border="2px solid"
      borderColor={isSelected ? 'green.600' : 'gray.200'}
      bg="white"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      _hover={{ bg: 'gray.50', borderColor: 'gray.400' }}
      transition="all 0.15s ease"
      cursor="default"
      onDoubleClick={() => onOpen(notebook.id)}
    >
      {isEditing ? (
        <Input
          value={draftName}
          onChange={(event) => setDraftName(event.target.value)}
          onBlur={commitRename}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              commitRename();
            }
          }}
          onClick={(event) => event.stopPropagation()}
          autoFocus
        />
      ) : (
        <Text fontSize="lg" fontWeight="semibold" color="gray.700">
          {notebook.name}
        </Text>
      )}

      {!isEditing ? (
        <Button
          size="sm"
          variant="ghost"
          color="gray.600"
          onClick={(event) => {
            event.stopPropagation();
            setDraftName(notebook.name);
            setIsEditing(true);
          }}
        >
          Edit
        </Button>
      ) : null}
    </Box>
  );
}
