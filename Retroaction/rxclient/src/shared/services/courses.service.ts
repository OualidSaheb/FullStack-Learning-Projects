import type { CourseFormInterface, CourseInterface } from '../interfaces';
import { api } from '@/shared/utils/axios';

const BASE_URL = '/courses';

export async function fetchCurrentDepartmentCourses(): Promise<CourseInterface[]> {
  const response = await api.get(`${BASE_URL}`);
  return response.data.result;
}

// export async function fetchAllCourses(): Promise<CourseInterface[]> {
//   const response = await api.get(`${BASE_URL}`);
//   return response.data.result;
// }

export async function fetchCoursesByDepartment(departmentId: string): Promise<CourseInterface[]> {
  const response = await api.get(`${BASE_URL}/departments/${departmentId}`);
  return response.data.result;
}

export async function getPopulatedCourse(courseId: string): Promise<CourseInterface> {
  const response = await api.get(`${BASE_URL}/${courseId}`);
  return response.data.result;
}

export async function createCourse(course: CourseFormInterface): Promise<CourseInterface> {
  const response = await api.post(`${BASE_URL}/`, course);
  return response.data.result;
}

export async function deleteCourse(courseId: string): Promise<CourseInterface> {
  const response = await api.delete(`${BASE_URL}/${courseId}`);
  return response.data.result;
}

export async function updateCourse(course: CourseInterface): Promise<CourseInterface> {
  const response = await api.patch(`${BASE_URL}/${course._id}`, course);
  return response.data.result;
}
