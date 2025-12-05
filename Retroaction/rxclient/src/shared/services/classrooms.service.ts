import type { ClassroomInterface } from '@/shared/interfaces';
import { api } from '@/shared/utils/axios';
const BASE_URL = '/classrooms';

export async function fetchCurrentSessionClassrooms(): Promise<ClassroomInterface[]> {
  const response = await api.get(BASE_URL);
  return response.data.result;
}
