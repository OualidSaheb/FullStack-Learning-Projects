import { defineStore } from "pinia";

export interface SearchState {
  // Pour toggle la visibilité
  show: boolean;
}

export const useSearch = defineStore("search", {
  state: (): SearchState => ({
    show: false,
  }),
  getters: {},
  actions: {
    toggleSearchVisibility() {
      this.show = !this.show;
    },
  },
});
