// stores/sessionsStore.ts
import { defineStore } from 'pinia';
import * as factory from '@/data/factory';
import type { SessionInterface, SessionFormInterface } from '@/shared/interfaces';
import { fetchAllSessions, createSession, updateSession, deleteSession } from '@/shared/services';

interface SessionStateInterface {
  sessions: Array<SessionInterface | SessionFormInterface>;
  currentSession: SessionInterface | SessionFormInterface | null;
}

export const useSessionsStore = defineStore('sessions', {
  state: (): SessionStateInterface => ({
    sessions: [],
    currentSession: null
  }),

  actions: {
    async fetchSessions() {
      try {
        // Assuming fetchAllSessions fetches all session data
        let sessions = await fetchAllSessions();
        // Sort sessions by the endsOn date
        sessions = sessions.sort((a, b) => new Date(a.endsOn) - new Date(b.endsOn));
        this.sessions = sessions;
      } catch (error: any) {
        throw new Error(`Error fetching sessions: ${error.message}`);
      }
    },

    async createSession(): Promise<SessionFormInterface> {
      try {
        const session = { ...factory.generateNewSession(), displayTitle: 'Nouvelle Session' };
        this.sessions.push(session);
        this.currentSession = session;
        return session;
      } catch (error: any) {
        throw new Error(`Error creating a session: ${error.message}`);
      }
    },

    async updateCurrentSession(): Promise<SessionInterface> {
      try {
        if (this.currentSession) {
          if (this.currentSession.isNew) {
            this.currentSession = await createSession(this.currentSession as SessionFormInterface);
            return this.currentSession as SessionInterface;
          } else {
            this.currentSession = await updateSession(this.currentSession as SessionInterface);
            return this.currentSession as SessionInterface;
          }
        }
        throw new Error('No current session to update');
      } catch (error: any) {
        throw new Error(`Error updating session: ${error.message}`);
      }
    },

    async deleteSession(sessionId: string): Promise<boolean> {
      try {
        await deleteSession(sessionId);
        this.sessions = this.sessions.filter((session) => session._id !== sessionId);

        // Clear currentSession if it was the one deleted
        if (this.currentSession && this.currentSession._id === sessionId) {
          this.currentSession = null;
        }

        return true;
      } catch (error: any) {
        console.error('Error deleting session:', error);
        throw new Error(`Error deleting session: ${error.message}`);
      }
    },

    setCurrentSession(sessionId: string) {
      const sessionFound = this.sessions.find((session) => session._id === sessionId);
      if (sessionFound) {
        this.currentSession = sessionFound;
      } else {
        this.currentSession = null;
      }
    }
  }
});
