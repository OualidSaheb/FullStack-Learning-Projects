import type {
  GridInterface,
  SectionInterface,
  LevelInterface,
  GridFormInterface
} from '@/shared/interfaces';
import { api } from '@/shared/utils/axios';
const BASE_URL = '/grids';

export async function fetchAllGrids(): Promise<GridInterface[]> {
  const response = await api.get(BASE_URL);
  return response.data.result;
}

export async function fetchPopulatedGrid(gridId: string): Promise<GridInterface> {
  const response = await api.get(`${BASE_URL}/${gridId}`);
  return response.data.result;
}

export async function fetchCourseGrids(courseId: string): Promise<GridInterface[]> {
  const response = await api.get(`${BASE_URL}/course/${courseId}`);
  return response.data.result;
}

export async function deleteGrid(gridId: string): Promise<GridInterface> {
  const response = await api.delete(`${BASE_URL}/${gridId}`);
  return response.data.result;
}

export async function createGrid(
  grid: GridFormInterface,
  isUserGrid: Boolean = false
): Promise<GridInterface> {
  const response = await api.post(`${BASE_URL}${isUserGrid ? '/user' : ''}`, { grid });
  return response.data.result;
}

export async function generateUserGrid(gridId: string): Promise<GridInterface> {
  const response = await api.post(`${BASE_URL}/${gridId}/generate-user-grid`);
  return response.data.result;
}

export async function updateGrid(grid: GridInterface): Promise<GridInterface> {
  const response = await api.put(`${BASE_URL}/${grid._id}`, grid);
  return response.data.result;
}

export async function createSection(gridId: string): Promise<SectionInterface> {
  const response = await api.post(`${BASE_URL}/${gridId}/section`);
  return response.data.result;
}
