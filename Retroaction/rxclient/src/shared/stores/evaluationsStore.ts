import { defineStore } from 'pinia';
//@ts-ignore
import evaluationData from '@/data/startedEvaluation.json';
import * as factory from '@/data/factory';

import type {
  GridInterface,
  EvaluationInterface,
  CorrectionInterface,
  EvaluationFormInterface,
  ResultInterface
} from '@/shared/interfaces';
import {
  fetchClassroomEvaluations,
  deleteEvaluation,
  getPopulatedEvaluation,
  createEvaluation,
  updateEvaluation,
  startEvaluation
} from '@/shared/services';

interface EvaluationStateInterface {
  evaluations: Array<EvaluationInterface | EvaluationFormInterface>;
  currentEvaluation: EvaluationInterface | EvaluationFormInterface | null;
  currentCorrection: CorrectionInterface | null;
  currentGrid: GridInterface | null;
  currentResult: ResultInterface | null;
}

export const useEvaluationStore = defineStore('evaluations', {
  state: (): EvaluationStateInterface => ({
    evaluations: [],
    currentEvaluation: null,
    currentCorrection: null,
    currentGrid: null,
    currentResult: null
  }),
  getters: {
    getEvaluations(
      state: EvaluationStateInterface
    ): Array<EvaluationInterface | EvaluationFormInterface> {
      return state.evaluations;
    }
  },
  actions: {
    async fetchClassroomEvaluations(classroomId: string) {
      try {
        this.evaluations = await fetchClassroomEvaluations(classroomId);
      } catch (error: any) {
        throw new Error(
          `Error fetching course evaluations for classroom id=${classroomId} : ${error.message}`
        );
      }
    },
    async createEvaluation(classroomId: string) {
      try {
        const evaluation = { ...factory.generateEvaluation(classroomId) };
        this.evaluations.push(evaluation);
        this.currentEvaluation = evaluation;
        return evaluation;
      } catch (error: any) {
        throw new Error(`Error creating a evaluation : ${error.message}`);
      }
    },

    async updateCurrentEvaluation(): Promise<EvaluationInterface> {
      try {
        if (this.currentEvaluation) {
          if (this.currentEvaluation.isNew) {
            this.currentEvaluation = await createEvaluation(
              this.currentEvaluation as EvaluationFormInterface
            );
            return this.currentEvaluation as EvaluationInterface;
          } else {
            this.currentEvaluation = await updateEvaluation(
              this.currentEvaluation as EvaluationInterface
            );
            return this.currentEvaluation as EvaluationInterface;
          }
        }
        throw new Error(`No current evaluation to update`);
      } catch (error: any) {
        throw new Error(`Error updating an evaluation : ${error.message}`);
      }
    },

    async fetchPopulatedEvaluation(evaluationId: string) {
      try {
        const localEvaluation = this.evaluations.find(
          (e) => e._id === evaluationId && e.isNew === true
        );
        this.currentEvaluation = localEvaluation
          ? localEvaluation
          : await getPopulatedEvaluation(evaluationId);
        return this.currentEvaluation;
      } catch (error: any) {
        throw new Error(`Error fetching an evaluation : ${error.message}`);
      }
    },

    async deleteEvaluation(evaluation: EvaluationInterface) {
      try {
        const deleteEvaluationA: EvaluationInterface = await deleteEvaluation(evaluation._id);
        if (deleteEvaluationA)
          this.evaluations = this.evaluations.filter((e) => e._id != evaluation._id);
        return deleteEvaluationA;
      } catch (error: any) {
        throw new Error(`Error deleting an evaluation : ${error.message}`);
      }
    },
    async startEvaluation() {
      try {
        if (this.currentEvaluation && this.currentEvaluation.state === 'created') {
          this.currentEvaluation = await startEvaluation(
            this.currentEvaluation as EvaluationInterface
          );
          return this.currentEvaluation;
        }
      } catch (error: any) {
        throw new Error(`Error starting an evaluation : ${error.message}`);
      }
    },
    setCurrentCorrection(correctionId: string) {
      const correctionFound = this.currentEvaluation?.corrections?.find(
        (correction) => correction._id === correctionId
      );
      if (correctionFound) {
        this.currentCorrection = correctionFound;
      }
    },
    setCurrentGrid() {
      const foundGrid = this.currentEvaluation?.grid;
      if (foundGrid) {
        this.currentGrid = foundGrid;
      }
    },
    setCurrentResult(criterionId: string) {
      const resultFound = this.currentCorrection?.results?.find(
        (result) => result.criterion._id === criterionId
      );

      if (resultFound) {
        this.currentResult = resultFound;
      }
    }
  }
});
