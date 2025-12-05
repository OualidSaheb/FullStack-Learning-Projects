import { defineStore } from "pinia";
import { fetchCurrentUser, createUser, editUserProfile, fetchOrders } from "@/shared/services/user.service";
import { signIn, signOut } from "@/shared/services/auth.service";

import type { UserInterface, UserFormInterface, SigninFormInterface } from "@/shared/interfaces/User.interface";
import { OrderInterface, cardType, PaymentCardInerface } from "@/shared/interfaces/order.interface";

interface UserState {
  currentUser: UserInterface | null | undefined;
  error: any;

  email: string;
  show: boolean;

  orders: OrderInterface[];
}

export const useUser = defineStore("user", {
  state: (): UserState => ({
    currentUser: undefined,
    error: null,

    //pour affiche le dialog of login
    show: false,
    email: "",

    orders: [],
  }),
  getters: {
    isAuthenticated(): boolean {
      return !!this.currentUser;
    },
  },
  actions: {
    async getOrders() {
      const orders = await fetchOrders();
      this.orders = orders;
      return orders;
    },
    async createUser(data: UserFormInterface) {
      try {
        this.currentUser = await createUser(data);
        this.currentUser = undefined;
        this.error = null;
      } catch (error) {
        this.currentUser = undefined;
        this.error = error;
      }
    },

    async signIn(data: SigninFormInterface) {
      try {
        this.currentUser = await signIn(data);
        this.error = null;
      } catch (error) {
        this.currentUser = undefined;
        this.error = error;
      }
    },

    async fetchCurrentUser() {
      try {
        this.currentUser = await fetchCurrentUser();
        this.error = null;
      } catch (error) {
        this.currentUser = undefined;
        this.error = error;
      }
    },

    async signOut() {
      try {
        await signOut();
        console.log("Signed out");

        this.currentUser = undefined;
        this.error = null;
      } catch (error) {
        this.error = error;
      }
    },
    async editProfile(updatedData: UserFormInterface) {
      try {
        // Perform the Axios patch request here to update the user's profile
        await editUserProfile(updatedData);

        // Update the user data in the store
        if (this.currentUser) {
          Object.assign(this.currentUser, updatedData);
        }

        this.error = null;
      } catch (error) {
        this.error = error;
      }
    },
  },
});
