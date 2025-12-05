import { defineStore } from 'pinia';
import type { StudentInterface, TeacherInterface, UserInterface } from '../interfaces';

import {
  fetchStudents,
  fetchTeachers,
  fetchCoordinators,
  fetchCurrentUser
} from '@/shared/services';

interface UserState {
  currentUser: UserInterface | null;
  students: StudentInterface[];
  teachers: TeacherInterface[];
  coordinators: TeacherInterface[];
}

export const useUsersStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    currentUser: null,
    students: [],
    teachers: [],
    coordinators: []
  }),
  getters: {
    getUsers: (state): UserInterface[] => state.students,
    getCurrentUser: (state): UserInterface | null => state.currentUser,
    getTeachers: (state): UserInterface[] => state.teachers,
    getTeachersById: (state) => (id: string) => {
      return state.teachers.find((teacher) => teacher._id === id);
    },
    getStudentsById: (state) => (id: string) => {
      return state.students.find((student) => student._id === id);
    }
  },
  actions: {
    async fetchStudents() {
      this.students = await fetchStudents();
    },
    async fetchTeachers() {
      this.teachers = await fetchTeachers();
    },
    async fetchCoordinators() {
      this.coordinators = await fetchCoordinators();
    },
    async fetchCurrentUser() {
      this.currentUser = await fetchCurrentUser();
    },
    setCurrentUser(user: UserInterface) {
      this.currentUser = user;
    }
  }
});
