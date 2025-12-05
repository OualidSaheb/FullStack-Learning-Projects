import type { UserInterface, UserFormInterface, TeacherFormInterface } from '@/shared/interfaces';
import { api } from '@/shared/utils/axios';

const BASE_URL = '/users';

// TODO check if we wanna create user or update user
export async function createUser(userForm: UserFormInterface) {
  //try {
  const response = await api.post(BASE_URL, userForm);
  if (response.data.result.user) {
    return response.data.result.user;
  } else {
    throw await response.data.result;
  }
  /* } catch (e) {
    throw e;
  }*/
}

// TODO test function// TODO
export async function fetchCurrentUser(): Promise<UserInterface | null> {
  const response = await api.get(`${BASE_URL}`);
  return response.data.result;
}

// TODO test function// TODO
export async function updateCurrentUser(user: UserInterface): Promise<UserInterface | null> {
  //try {
  return await api.put(`${BASE_URL}`, user);
  /*} catch (e) {
    throw e;
  }*/
}

export async function updateUserDepartment(deptId: string | undefined) {
  if (deptId !== undefined) {
    await api.patch(`${BASE_URL}/department`, { departmentId: deptId });
  }
}

export async function fetchUserById(userId: string) {
  const response = await api.get(`${BASE_URL}/user/${userId}`);
  return response.data.result;
}

// Peut servir plus tard si on a besoins de fetcher tous les etudiants d'une organisation
export async function fetchStudents() {
  const response = await api.get(`${BASE_URL}/students`);
  return response.data.result;
}

export async function fetchTeachers() {
  const response = await api.get(`${BASE_URL}/teachers`);
  return response.data.result;
}
export async function fetchCoordinators() {
  const response = await api.get(`${BASE_URL}/coordinators`);
  return response.data.result;
}

export async function createTeacher(newTeacher: TeacherFormInterface) {
  const response = await api.post(`${BASE_URL}/addTeacher`, newTeacher);
  return response.data.result;
}

export async function updateTeacher(updatedTeacher: TeacherFormInterface) {
  const response = await api.put(
    `${BASE_URL}/update/teacher/${updatedTeacher._id}`,
    updatedTeacher
  );
  return response.data.result;
}

export async function deleteUser(userId: string) {
  const response = await api.delete(`${BASE_URL}/delete/${userId}`);
  return response.data.result;
}
