import { localApiClient } from '@/shared/utils/api-client';
import type {
  NotebookResponse,
  UpdateNotebookInput,
} from '../types/notebook.types';

export async function updateNotebook(
  id: string,
  updates: UpdateNotebookInput,
): Promise<NotebookResponse> {
  return localApiClient.put<NotebookResponse>(`/api/notebooks/${id}`, updates);
}
