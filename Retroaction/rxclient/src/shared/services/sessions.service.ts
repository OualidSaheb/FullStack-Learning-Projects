import type { SessionInterface, SessionFormInterface } from '@/shared/interfaces';
import { api } from '@/shared/utils/axios';
const BASE_URL = '/sessions';

export async function fetchAllSessions(): Promise<SessionInterface[]> {
  const response = await api.get(BASE_URL);
  return response.data.result;
}

export async function createSession(session: SessionFormInterface): Promise<SessionInterface> {
  const response = await api.post(`${BASE_URL}/`, session);
  return response.data.result;
}

export async function updateSession(session: SessionInterface): Promise<SessionInterface> {
  const response = await api.put(`${BASE_URL}/${session._id}`, session);
  return response.data.result;
}

export async function deleteSession(sessionId: string): Promise<SessionInterface> {
  const response = await api.delete(`${BASE_URL}/${sessionId}`);
  return response.data.result;
}
