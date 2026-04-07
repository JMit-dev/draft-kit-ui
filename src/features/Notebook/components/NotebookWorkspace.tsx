import { Box, Button, Text } from '@chakra-ui/react';

type NotebookWorkspaceProps = {
  selectedNotebookName: string | null;
  onCloseNotebook: () => void;
};

export default function NotebookWorkspace({
  selectedNotebookName,
  onCloseNotebook,
}: NotebookWorkspaceProps) {
  return (
    <>
      <Box
        flex="1"
        borderRadius="md"
        border="2px solid"
        borderColor="gray.200"
        bg="white"
      />

      {selectedNotebookName ? (
        <Box
          position="fixed"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="blackAlpha.200"
          zIndex={10}
        >
          <Box
            w="320px"
            minH="220px"
            borderRadius="md"
            border="2px solid"
            borderColor="gray.200"
            bg="white"
            p={5}
            position="relative"
          >
            <Button
              size="xs"
              variant="ghost"
              position="absolute"
              top={3}
              right={3}
              minW="auto"
              h="24px"
              px={2}
              onClick={onCloseNotebook}
            >
              X
            </Button>
            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
              {selectedNotebookName}
            </Text>
          </Box>
        </Box>
      ) : null}
    </>
  );
}
