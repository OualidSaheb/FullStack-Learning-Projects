import type { EvaluationInterface, EvaluationFormInterface } from '@/shared/interfaces';

import { api } from '@/shared/utils/axios';
const BASE_URL = '/evaluations';

export async function fetchClassroomEvaluations(
  classroomId: string
): Promise<EvaluationInterface[]> {
  const response = await api.get(`${BASE_URL}/classrooms/${classroomId}`);
  return response.data.result;
}

export async function createEvaluation(
  evaluation: EvaluationFormInterface
): Promise<EvaluationInterface> {
  const response = await api.post(`${BASE_URL}/`, evaluation);
  return response.data.result;
}

export async function updateEvaluation(
  evaluation: EvaluationInterface
): Promise<EvaluationInterface> {
  const response = await api.put(`${BASE_URL}/${evaluation._id}`, evaluation);
  return response.data.result;
}

export async function deleteEvaluation(evaluationId: string): Promise<EvaluationInterface> {
  const response = await api.delete(`${BASE_URL}/${evaluationId}`);
  return response.data.result;
}

export async function getPopulatedEvaluation(evaluationId: string): Promise<EvaluationInterface> {
  const response = await api.get(`${BASE_URL}/${evaluationId}`);
  return response.data.result;
}

export async function startEvaluation(
  evaluation: EvaluationInterface
): Promise<EvaluationInterface> {
  const response = await api.patch(`${BASE_URL}/${evaluation._id}/start`, evaluation);
  return response.data.result;
}
