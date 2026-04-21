import { localApiClient } from '@/shared/utils/api-client';
import type { NotebookResponse } from '../types/notebook.types';

export async function createNotebook(name: string): Promise<NotebookResponse> {
  return localApiClient.post<NotebookResponse>('/api/notebooks', {
    kind: 'custom',
    name,
    content: '',
  });
}
