import { defineStore } from 'pinia';
import * as factory from '@/data/factory';
import type { CourseInterface, CourseFormInterface } from '@/shared/interfaces';
import {
  fetchCurrentDepartmentCourses,
  fetchCoursesByDepartment,
  createCourse,
  updateCourse,
  deleteCourse,
  getPopulatedCourse
} from '@/shared/services/courses.service';

interface CourseStateInterface {
  courses: Array<CourseInterface | CourseFormInterface>;
  currentCourse: CourseInterface | CourseFormInterface | null;
}

export const useCoursesStore = defineStore('courses', {
  state: (): CourseStateInterface => ({
    courses: [],
    currentCourse: null
  }),

  getters: {
    getCurrentCourse(): CourseInterface | CourseFormInterface | null {
      return this.currentCourse;
    },
    // getDepartmentCourses:
    //   (state: CourseStateInterface) =>
    //   (departementId: string): CourseInterface[] => {
    //     return state.courses.filter((c) => c.department === departementId);
    //   },

    getCoursesByDepartment: (state: CourseStateInterface) => {
      return (departmentId: string) =>
        state.courses.filter((course) => course.department === departmentId);
    }
  },

  actions: {
    async fetchCurrentDepartmentCourses(): Promise<void> {
      try {
        this.courses = await fetchCurrentDepartmentCourses();
      } catch (error: any) {
        throw new Error(`Error fetching deparment courses : ${error.message}`);
      }
    },

    async fetchCoursesForDepartment(departmentId: string) {
      try {
        this.courses = await fetchCoursesByDepartment(departmentId);
      } catch (error: any) {
        throw new Error(`Error fetching courses for department: ${error.message}`);
      }
    },

    async fetchPopulatedCourse(courseId: string): Promise<void> {
      try {
        this.currentCourse = await getPopulatedCourse(courseId);
      } catch (error: any) {
        throw new Error(`Error fetching deparment course id=${courseId} : ${error.message}`);
      }
    },

    async createCourse(departmentId: string): Promise<CourseFormInterface> {
      try {
        const course = {
          ...factory.generateNewCourse(departmentId),
          displayTitle: 'Nouveau cours'
        };
        this.courses.push(course);
        this.currentCourse = course;
        return course;
      } catch (error: any) {
        throw new Error(`Error creating a department: ${error.message}`);
      }
    },

    async updateCurrentCourse(): Promise<CourseInterface> {
      try {
        if (this.currentCourse) {
          if (this.currentCourse.isNew) {
            this.currentCourse = await createCourse(this.currentCourse as CourseFormInterface);
            return this.currentCourse as CourseInterface;
          } else {
            this.currentCourse = await updateCourse(this.currentCourse as CourseInterface);
            return this.currentCourse as CourseInterface;
          }
        }
        throw new Error('No current course to update');
      } catch (error: any) {
        throw new Error(`Error updating course: ${error.message}`);
      }
    },

    async deleteCourse(courseId: string): Promise<boolean> {
      try {
        await deleteCourse(courseId);
        this.courses = this.courses.filter((c) => c._id !== courseId);
        if (this.currentCourse && this.currentCourse._id === courseId) {
          this.currentCourse = null;
        }
        return true;
      } catch (error: any) {
        throw new Error(`Error deleting course: ${error.message}`);
      }
    },

    setCurrentCourse(courseId: string) {
      const courseFound = this.courses.find((course) => course._id === courseId);
      if (courseFound) {
        this.currentCourse = courseFound;
      } else {
        this.currentCourse = null;
      }
    },
    async setDepartmentTitleForCurrentCourse() {
      if (this.currentCourse && this.currentCourse.department) {
        try {
          const department = await fetchDepartmentById(this.currentCourse.department);
          this.currentDepartmentTitle = department.title;
        } catch (error: any) {
          console.error('Error fetching department:', error);
          this.currentDepartmentTitle = null;
        }
      } else {
        this.currentDepartmentTitle = null;
      }
    }
  }
});
