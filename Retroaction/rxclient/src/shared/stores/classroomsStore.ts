import { defineStore } from 'pinia';
import type { ClassroomInterface } from '../interfaces';
import { fetchCurrentSessionClassrooms } from '@/shared/services';

interface ClassroomStateInterface {
  classrooms: ClassroomInterface[];
  currentClassroom: ClassroomInterface | null;
}

export const useClassroomsStore = defineStore('classrooms', {
  state: (): ClassroomStateInterface => ({
    classrooms: [] as ClassroomInterface[],
    currentClassroom: {} as ClassroomInterface
  }),

  getters: {},

  actions: {
    async fetchCurrentSessionClassrooms(): Promise<void> {
      try {
        this.classrooms = await fetchCurrentSessionClassrooms();
      } catch (error: any) {
        throw new Error(`Error fetching current session classrooms : ${error.message}`);
      }
    },
    async fetchPopulatedClassroom(classroomId: string) {
      const classroom = this.classrooms.find((c) => c._id === classroomId);
      if (classroom) {
        this.currentClassroom = classroom;
      }
    }
  }
});
