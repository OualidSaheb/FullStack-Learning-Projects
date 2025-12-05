import { defineStore } from 'pinia';
import data from '@/data/default.json';
import * as factory from '@/data/factory';

import type {
  GridInterface,
  GridFormInterface,
  UserGridInterface,
  SectionInterface,
  CriterionInterface,
  LevelInterface,
  SectionFormInterface,
  CriterionFormInterface,
  LevelFormInterface,
  CourseInterface
} from '@/shared/interfaces';

import {
  fetchPopulatedGrid,
  fetchCourseGrids,
  createGrid,
  updateGrid,
  deleteGrid,
  createSection
} from '@/shared/services';

interface GridStateInterface {
  grids: Array<GridInterface | GridFormInterface>;
  currentGrid: GridInterface | GridFormInterface | null;
  currentSection: SectionInterface | SectionFormInterface | null;
  currentCriterion: CriterionInterface | CriterionFormInterface | null;
  currentLevel: LevelInterface | LevelFormInterface | null;
}
export const useGridsStore = defineStore('grids', {
  state: (): GridStateInterface => ({
    grids: [],
    currentGrid: null,
    currentSection: null,
    currentLevel: null,
    currentCriterion: null
  }),

  getters: {
    getGrids(state: GridStateInterface): GridInterface[] {
      return state.grids.filter((grid) => grid?.kind !== 'UserGrid') as GridInterface[];
    },
    getUserGrids(state: GridStateInterface): UserGridInterface[] {
      return state.grids.filter((grid) => grid?.kind === 'UserGrid') as UserGridInterface[];
    },
    getGrid:
      (state: GridStateInterface) =>
      (gridId: string): GridInterface => {
        return state.grids.find((grid) => grid._id === gridId) as GridInterface;
      },
    getMaxLevelValue:
      (state: GridStateInterface) =>
      (criterion: CriterionInterface): number => {
        if (criterion && criterion.levels) {
          return criterion.levels.reduce((maxValue, level) => {
            return Math.max(maxValue, level.value);
          }, 0);
        }

        return 0;
      },
    getTotalSectionValue:
      (state: GridStateInterface) =>
      (section: SectionInterface): number => {
        if (section && section.criteria) {
          return section.criteria.reduce((totalValue, criterion) => {
            const maxLevelValue = state.getGetterMaxLevelValue(criterion);
            return totalValue + maxLevelValue;
          }, 0);
        }

        return 0;
      },
    getTotalForAllSections: (state: GridStateInterface): number => {
      if (state.currentGrid && state.currentGrid.sections) {
        return state.currentGrid.sections.reduce((totalGridValue, section) => {
          const sectionValue = state.getGetterSectionValue(section);
          return totalGridValue + sectionValue;
        }, 0);
      }

      return 0;
    }
  },
  actions: {
    /**
     * Fetches all grids for the current course in course store
     */
    async fetchCourseGrids(courseId: string) {
      try {
        this.grids = await fetchCourseGrids(courseId);
      } catch (error: any) {
        throw new Error(`Error fetching course grids for course id=${courseId} : ${error.message}`);
      }
    },

    /**
     * Setting the current grid to the grid with the given id
     * @param gridId
     */
    /*     setCurrentGrid(gridId: string) {
      const foundGrid = this.grids.find((grid) => grid._id === gridId);
      if (foundGrid) {
        this.currentGrid = foundGrid;
        this.setCurrentSection(foundGrid.sections[0]._id);
      }
    }, */
    /**
     * Setting the current section to the section with the given id
     * @param sectionId
     */
    setCurrentSection(sectionId: string) {
      const sectionFound = this.currentGrid?.sections?.find((section) => section._id == sectionId);
      if (sectionFound) {
        this.currentSection = sectionFound;
        if (sectionFound.criteria?.length) {
          this.setCurrentCriterion(sectionFound.criteria[0]?._id!);
        }
      }
    },
    /**
     * Setting the current level to the level with the given id
     * @param criterionId
     */
    setCurrentCriterion(criterionId: string) {
      const criterionFound = this.currentSection?.criteria?.find(
        (criterion) => criterion._id === criterionId
      );
      if (criterionFound) {
        this.currentCriterion = criterionFound;
        if (criterionFound.levels?.length) {
          this.setCurrentLevel(criterionFound.levels[0]?._id!);
        }
      }
    },
    /**
     * Setting the current level to the level with the given id
     * @param levelId
     */
    setCurrentLevel(levelId: string) {
      const levelFound = this.currentCriterion?.levels?.find((level) => level._id === levelId);
      if (levelFound) {
        this.currentLevel = levelFound;
      }
    },

    async fetchPopulatedGrid(gridId: string) {
      try {
        const localGrid = this.grids.find((grid) => grid._id === gridId && grid.isNew === true);
        this.currentGrid = localGrid ? localGrid : await fetchPopulatedGrid(gridId);
        return this.currentGrid;
      } catch (error: any) {
        throw new Error(`Error fetching course grid id=${gridId} : ${error.message}`);
      }
    },
    async createGrid(courseId: string, isUserGrid: boolean = false) {
      try {
        // Prendre las grille du JSON

        // Passer dans une / des fonction de génération de UUID()
        const grid = { ...factory.generateNewGrid(courseId, isUserGrid) };
        this.grids.push(grid);
        this.currentGrid = grid;
        return grid;
      } catch (error: any) {
        throw new Error(`Error creating a grid : ${error.message}`);
      }
    },
    async updateCurrentGrid(): Promise<Boolean> {
      try {
        if (this.currentGrid) {
          if (this.currentGrid.isNew) {
            this.currentGrid = await createGrid(this.currentGrid as GridFormInterface);
            return !!(this.currentGrid as GridInterface);
          } else {
            this.currentGrid = await updateGrid(this.currentGrid as GridInterface);
            return !!(this.currentGrid as GridInterface);
          }
        }
        throw new Error(`No current grid to update`);
      } catch (error: any) {
        throw new Error(`Error updating a grid : ${error.message}`);
      }
    },
    async deleteGrid(grid: GridInterface) {
      try {
        const deletedGrid = await deleteGrid(grid._id);
        if (deletedGrid) this.grids = this.grids.filter((g) => g._id != grid._id);
        return deletedGrid;
      } catch (error: any) {
        throw new Error(`Error deleting a grid : ${error.message}`);
      }
    },
    async createSection(): Promise<SectionFormInterface> {
      try {
        const section = { ...factory.generateNewSection() };
        if (section) this.currentGrid?.sections?.push(section);
        return section;
      } catch (error: any) {
        throw new Error(`Error creating a section : ${error.message}`);
      }
    },
    async deleteSection(sectionId: string): Promise<Boolean> {
      try {
        if (this.currentGrid)
          this.currentGrid.sections = this.currentGrid?.sections?.filter(
            (section) => section._id !== sectionId
          );
        return true;
      } catch (error: any) {
        throw new Error(`Error deleting a section : ${error.message}`);
      }
    },
    async createCriterion(): Promise<CriterionFormInterface> {
      try {
        const criterion = { ...factory.generateNewCriterion() };
        if (criterion) this.currentSection?.criteria?.push(criterion);
        return criterion;
      } catch (error: any) {
        throw new Error(`Error creating a criterion : ${error.message}`);
      }
    },
    async deleteCriterion(criterionId: string): Promise<Boolean> {
      try {
        if (this.currentSection)
          this.currentSection.criteria = this.currentSection.criteria?.filter(
            (criterion) => criterion._id !== criterionId
          );
        return true;
      } catch (error: any) {
        throw new Error(`Error deleting a criterion : ${error.message}`);
      }
    },
    async createLevel(): Promise<LevelFormInterface> {
      try {
        const level = { ...factory.generateNewLevel() };
        if (level) this.currentCriterion?.levels?.push(level);
        return level;
      } catch (error: any) {
        throw new Error(`Error creating a level : ${error.message}`);
      }
    },
    async deleteLevel(levelId: string): Promise<Boolean> {
      try {
        if (this.currentCriterion)
          this.currentCriterion.levels = this.currentCriterion.levels?.filter(
            (level) => level._id !== levelId
          );
        return true;
      } catch (error: any) {
        throw new Error(`Error deleting a criterion : ${error.message}`);
      }
    },
    getGetterMaxLevelValue(criterion: CriterionInterface): number {
      return this.getMaxLevelValue(criterion);
    },
    getGetterSectionValue(section: SectionInterface): number {
      return this.getTotalSectionValue(section);
    }
  }
});
