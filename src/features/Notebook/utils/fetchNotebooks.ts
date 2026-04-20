import { localApiClient } from '@/shared/utils/api-client';
import type { NotebooksResponse } from '../types/notebook.types';

export async function fetchNotebooks(): Promise<NotebooksResponse> {
  return localApiClient.get<NotebooksResponse>('/api/notebooks');
}
