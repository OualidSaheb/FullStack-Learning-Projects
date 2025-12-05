import type { DepartmentInterface, DepartmentFormInterface } from '@/shared/interfaces';
import { api } from '@/shared/utils/axios';
const BASE_URL = '/departments';

export async function fetchAllDepartments(): Promise<DepartmentInterface[]> {
  const response = await api.get(BASE_URL);
  return response.data.result;
}

export async function createDepartment(
  department: DepartmentFormInterface
): Promise<DepartmentInterface> {
  const response = await api.post(`${BASE_URL}/`, department);
  return response.data.result;
}

export async function updateDepartment(
  department: DepartmentInterface
): Promise<DepartmentInterface> {
  const response = await api.put(`${BASE_URL}/${department._id}`, department);
  return response.data.result;
}

export async function deleteDepartment(departmentId: string): Promise<DepartmentInterface> {
  const response = await api.delete(`${BASE_URL}/${departmentId}`);
  return response.data.result;
}
