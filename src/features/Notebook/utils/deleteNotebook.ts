import { localApiClient } from '@/shared/utils/api-client';
import type { NotebookResponse } from '../types/notebook.types';

export async function deleteNotebook(id: string): Promise<NotebookResponse> {
  return localApiClient.delete<NotebookResponse>(`/api/notebooks/${id}`);
}
