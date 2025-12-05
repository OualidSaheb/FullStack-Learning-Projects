import { defineStore } from "pinia";

export interface FilterState {
  show: boolean;
  categoryData: object;
  categoryShow: boolean;

  priceData: object;
  priceShow: boolean;

  brandData: object;
  brandShow: boolean;

  ratingData: object;
  ratingShow: boolean;
}

export const useFilter = defineStore("filter", {
  state: (): FilterState => ({
    show: false,
    categoryData: [
      {
        name: "pants",
      },
      {
        name: "comforters",
      },
      {
        name: "bras",
      },
      {
        name: "dockers",
      },
    ],
    categoryShow: false,

    priceData: [
      {
        name: "Under 15",
      },
      {
        name: "Between 15 and 100",
      },
      {
        name: "Between 100 and 500",
      },
      {
        name: "Over 500",
      },
    ],
    priceShow: false,

    brandData: [
      {
        name: "Dockers",
      },
      {
        name: "STAFFORD",
      },
      {
        name: "ARIZONA",
      },
      {
        name: "Glamorise",
      },
    ],
    brandShow: false,

    ratingData: [
      {
        name: "Under 3",
      },
      {
        name: "between 3 and 3.8",
      },
      {
        name: "between 3.8 and 4.5",
      },
      {
        name: "Over 4.5",
      },
    ],
    ratingShow: false,
  }),
  getters: {},
  actions: {
    filterToApply() {},
    openCategoryValue() {
      this.categoryShow = !this.categoryShow;
    },

    openPriceValue() {
      this.priceShow = !this.priceShow;
    },

    openBrandValue() {
      this.brandShow = !this.brandShow;
    },

    openRatingValue() {
      this.ratingShow = !this.ratingShow;
    },

    toggleFilterVisibility() {
      this.show = !this.show;
    },
  },
});
