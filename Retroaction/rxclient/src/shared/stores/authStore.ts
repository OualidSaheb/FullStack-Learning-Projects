import { defineStore } from 'pinia';
import type { SignInFormInterface, UserFormInterface, UserInterface } from '@/shared/interfaces';
import { initializeLogRocket } from '@/utils/logRocketSetup';

import {
  fetchCurrentUser,
  signIn,
  updateCurrentUser,
  updateUserPassword,
  sendEmailToUpdatePassword,
  checkEmail,
  resetEmailPassword
} from '@/shared/services';

import { useRouter } from 'vue-router';
import { useUsersStore } from './userStore';

export interface AuthState {
  user: UserInterface | null;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null
  }),

  getters: {
    /**
     * Know if there is currently a valid authentification
     * @param state
     * @returns true if there is a user stores, false otherwise
     */
    isAuthenticated(state): boolean | null {
      return !!state.user;
    },

    getCurrentUser(state) {
      return state.user;
    },
    //todo: fix this
    getCurrentUserDepartment(state) {
      // return state.user?.department;
    }
  },

  actions: {
    resetUser() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },

    /**
     * Try to activate an authentification with the given loginForm.
     * Using the "login" service, it will try to get a token and a user.
     * If it succeed, it will fetch for the actual [Sessions]
     * @param loginForm email and password of the user.
     * @returns nil
     */
    async signIn(signInForm: SignInFormInterface) {
      try {
        const response = await signIn(signInForm);
        if (response) {
          this.user = response.user;
          useUsersStore().setCurrentUser(response.user!);
          this.token = response.token;
          localStorage.setItem('token', response.token!);
          console.log("patate");
          initializeLogRocket(this.user?.firstName + " " + this.user?.lastName , this.user?.local.email ? this.user?.local.email : "");
        } else {
          throw new Error("Erreur lors de l'authentification : ");
        }
      } catch (error: any) {
        throw new Error("Erreur lors de l'authentification : " + error.message);
      }
    },

    async logout() {
      try {
        //TODO: call logout service
        localStorage.removeItem('token');

        this.resetUser();
      } catch (e) {
        console.error(e);
      }
    },

    async tryRefreshToken() {
      if (localStorage.getItem('token')) {
        await this.fetchCurrentUser();
      }
    },

    async fetchCurrentUser() {
      const router = useRouter();
      this.user = await fetchCurrentUser();
      if (this.user) {
        useUsersStore().setCurrentUser(this.user);
        this.token = localStorage.getItem('token');
        const route = router.currentRoute.value.fullPath;
        if (route.includes('/signin')) {
          router.push('/home');
        }
      } else {
        localStorage.removeItem('token');
      }
    },

    async updateUser(user: UserInterface) {
      await updateCurrentUser(user);
    },

    async updateUserPassword(email: string, newPassword: string, resetPassToken: string) {
      const response = await updateUserPassword(email, newPassword, resetPassToken);
      if (response.local.email === email) {
        console.log('Mot de passe mis à jour');
        const signInForm = {
          email: email,
          password: newPassword
        };
        await this.signIn(signInForm);
      }
    },

    async sendEmailToUpdatePassword(users: UserFormInterface[]) {
      await sendEmailToUpdatePassword(users);
    },

    async resetEmailPassword(email: string) {
      await resetEmailPassword(email);
    },

    async checkEmail(email: string) {
      console.log('Il passe dans le Store');
      const verifiedMail = await checkEmail(email);

      console.log(verifiedMail);

      return verifiedMail;
    },

    //todo: fix this

    async updateUserDepartment() {
      // console.log('1');
      // if (this.user) {
      //   console.log(this.user.department.title);
      //   await updateUserDepartment(this.user.department._id);
      // }
    }
  }
});
