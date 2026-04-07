'use client';

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { Box, Button, Text, Textarea } from '@chakra-ui/react';

type NotebookWorkspaceProps = {
  selectedNotebookId: number | null;
  selectedNotebookName: string | null;
  selectedNotebookContent: string;
  onNotebookContentChange: (id: number, content: string) => void;
  onCloseNotebook: () => void;
};

export default function NotebookWorkspace({
  selectedNotebookId,
  selectedNotebookName,
  selectedNotebookContent,
  onNotebookContentChange,
  onCloseNotebook,
}: NotebookWorkspaceProps) {
  const [windowRect, setWindowRect] = useState({
    x: 0,
    y: 0,
    width: 420,
    height: 320,
  });
  const dragStateRef = useRef<{
    mode: 'move' | 'resize' | null;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    startWidth: number;
    startHeight: number;
  }>({
    mode: null,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    startWidth: 0,
    startHeight: 0,
  });

  useEffect(() => {
    if (!selectedNotebookName) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseNotebook();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseNotebook, selectedNotebookName]);

  useEffect(() => {
    if (!selectedNotebookName) {
      return;
    }

    const width = 420;
    const height = 320;

    setWindowRect({
      width,
      height,
      x: Math.max((window.innerWidth - width) / 2, 24),
      y: Math.max((window.innerHeight - height) / 2, 24),
    });
  }, [selectedNotebookName]);

  useEffect(() => {
    if (!selectedNotebookName) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const dragState = dragStateRef.current;

      if (dragState.mode === 'move') {
        setWindowRect((current) => ({
          ...current,
          x: Math.max(
            dragState.startLeft + event.clientX - dragState.startX,
            0,
          ),
          y: Math.max(dragState.startTop + event.clientY - dragState.startY, 0),
        }));
      }

      if (dragState.mode === 'resize') {
        setWindowRect((current) => ({
          ...current,
          width: Math.max(
            dragState.startWidth + event.clientX - dragState.startX,
            320,
          ),
          height: Math.max(
            dragState.startHeight + event.clientY - dragState.startY,
            220,
          ),
        }));
      }
    };

    const handleMouseUp = () => {
      dragStateRef.current.mode = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [selectedNotebookName]);

  const startMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    dragStateRef.current = {
      mode: 'move',
      startX: event.clientX,
      startY: event.clientY,
      startLeft: windowRect.x,
      startTop: windowRect.y,
      startWidth: windowRect.width,
      startHeight: windowRect.height,
    };
  };

  const startResize = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dragStateRef.current = {
      mode: 'resize',
      startX: event.clientX,
      startY: event.clientY,
      startLeft: windowRect.x,
      startTop: windowRect.y,
      startWidth: windowRect.width,
      startHeight: windowRect.height,
    };
  };

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
        <Box position="fixed" inset={0} bg="blackAlpha.200" zIndex={10}>
          <Box
            w={`${windowRect.width}px`}
            h={`${windowRect.height}px`}
            borderRadius="md"
            border="2px solid"
            borderColor="gray.200"
            bg="white"
            p={5}
            position="absolute"
            left={`${windowRect.x}px`}
            top={`${windowRect.y}px`}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={4}
              cursor="move"
              onMouseDown={startMove}
            >
              <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                {selectedNotebookName}
              </Text>
              <Button
                size="xs"
                variant="ghost"
                minW="auto"
                h="24px"
                px={2}
                onClick={onCloseNotebook}
              >
                X
              </Button>
            </Box>
            {selectedNotebookId !== null ? (
              <Textarea
                h={`calc(${windowRect.height}px - 88px)`}
                minH="140px"
                resize="none"
                value={selectedNotebookContent}
                onChange={(event) =>
                  onNotebookContentChange(
                    selectedNotebookId,
                    event.target.value,
                  )
                }
                placeholder="Write notes here..."
              />
            ) : null}
            <Box
              position="absolute"
              right={1}
              bottom={1}
              w="16px"
              h="16px"
              cursor="nwse-resize"
              onMouseDown={startResize}
            />
          </Box>
        </Box>
      ) : null}
    </>
  );
}
