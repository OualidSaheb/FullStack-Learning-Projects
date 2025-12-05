import { defineStore } from 'pinia';
import * as factory from '@/data/factory';

import type { DepartmentInterface, DepartmentFormInterface } from '@/shared/interfaces';
import {
  fetchAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '@/shared/services/departments.service';

interface DepartmentStateInterface {
  departments: Array<DepartmentInterface | DepartmentFormInterface>;
  currentDepartment: DepartmentInterface | DepartmentFormInterface | null;
}

export const useDepartmentsStore = defineStore('departments', {
  state: (): DepartmentStateInterface => ({
    departments: [],
    currentDepartment: null
  }),

  getters: {
    getDepartmentById: (state) => {
      return (departmentId: string) =>
        state.departments.find((department) => department._id === departmentId);
    }
  },

  actions: {
    async fetchDepartments() {
      try {
        this.departments = await fetchAllDepartments();
      } catch (error: any) {
        throw new Error(`Error fetching departments: ${error.message}`);
      }
    },

    async createDepartment(): Promise<DepartmentFormInterface> {
      try {
        const department = {
          ...factory.generateNewDepartment(),
          displayTitle: 'Nouveau département'
        };
        this.departments.push(department);
        this.currentDepartment = department;
        return department;
      } catch (error: any) {
        throw new Error(`Error creating a department: ${error.message}`);
      }
    },

    async updateCurrentDepartment(): Promise<DepartmentInterface> {
      try {
        if (this.currentDepartment) {
          if (this.currentDepartment.isNew) {
            this.currentDepartment = await createDepartment(
              this.currentDepartment as DepartmentFormInterface
            );
            return this.currentDepartment as DepartmentInterface;
          } else {
            this.currentDepartment = await updateDepartment(
              this.currentDepartment as DepartmentInterface
            );
            return this.currentDepartment as DepartmentInterface;
          }
        }
        throw new Error('No current department to update');
      } catch (error: any) {
        throw new Error(`Error updating department: ${error.message}`);
      }
    },

    async deleteDepartment(departmentId: string): Promise<boolean> {
      try {
        await deleteDepartment(departmentId);
        this.departments = this.departments.filter((d) => d._id !== departmentId);

        // Clear currentDepartment if it was the one deleted
        if (this.currentDepartment && this.currentDepartment._id === departmentId) {
          this.currentDepartment = null;
        }

        return true;
      } catch (error: any) {
        throw new Error(`Error deleting department: ${error.message}`);
      }
    },

    setCurrentDepartment(departmentId: string) {
      const departmentFound = this.departments.find(
        (department) => department._id === departmentId
      );
      if (departmentFound) {
        this.currentDepartment = departmentFound;
      } else {
        this.currentDepartment = null;
      }
    }
  }
});
