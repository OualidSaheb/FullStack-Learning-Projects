import { defineStore } from "pinia";
import type { ProductInterface } from "@/shared/interfaces/product.interface";
import products from "../data/products.json";

export interface productState {
  products: ProductInterface[];

  sortPrice: boolean;
  sortRating: boolean;
  direction: boolean;

  filterCategory: string;
  filterPrice: string;
  filterBrand: string;
  filterRating: string;

  searchName: string;
  saleProducts: ProductInterface[];
  show: boolean;
  countdown: number;
}

export const useProducts = defineStore("products", {
  state: (): productState => ({
    products: [],

    sortPrice: false,
    sortRating: false,
    direction: false,

    filterCategory: "",
    filterPrice: "",
    filterBrand: "",
    filterRating: "",

    searchName: "",
    show: false,

    saleProducts: products,
    countdown: localStorage.getItem("countdown") ? parseInt(localStorage.getItem("countdown")!) : 600,
  }),
  getters: {
    getProducts(state: productState): ProductInterface[] {
      switch (true) {
        case this.sortPrice || this.sortRating:
          return this.getProductsSort;
        case this.filterCategory !== "":
          return this.getProductsFilterCategory;
        case this.filterPrice !== "":
          return this.getProductsFilterPrice;
        case this.filterBrand !== "":
          return this.getProductsFilterBrand;
        case this.filterRating !== "":
          return this.getProductsFilterRating;
        case this.searchName !== "":
          return this.getProductsSearch;
        default:
          return state.products.sort((x, y) => x.id - y.id);
      }
    },

    getProductsSort(state: productState): ProductInterface[] {
      switch (true) {
        case this.sortPrice && !this.direction:
          return state.products.sort((x, y) => x.list_price - y.list_price);
        case this.sortPrice && this.direction:
          return state.products.sort((x, y) => y.list_price - x.list_price);
        case this.sortRating && !this.direction:
          return state.products.sort((x, y) => x.average_product_rating - y.average_product_rating);
        default:
          return state.products.sort((x, y) => y.average_product_rating - x.average_product_rating);
      }
    },

    getProductsFilterCategory(state: productState): ProductInterface[] {
      if (this.filterCategory === "") {
        return state.products.sort((x, y) => x.id - y.id);
      } else {
        return state.products.filter((product) => product.category === this.filterCategory);
      }
    },

    getProductsFilterPrice(state: productState): ProductInterface[] {
      switch (this.filterPrice) {
        case "":
          return state.products.sort((x, y) => x.id - y.id);
        case "Under 15":
          return state.products.filter((product) => product.list_price < 15);
        case "Between 15 and 100":
          return state.products.filter((product) => product.list_price >= 15 && product.list_price < 100);
        case "Between 100 and 500":
          return state.products.filter((product) => product.list_price >= 100 && product.list_price < 500);
        default:
          return state.products.filter((product) => product.list_price >= 500);
      }
    },

    getProductsFilterBrand(state: productState): ProductInterface[] {
      if (this.filterBrand === "") {
        return state.products.sort((x, y) => x.id - y.id);
      } else {
        return state.products.filter((product) => product.brand === this.filterBrand);
      }
    },

    getProductsFilterRating(state: productState): ProductInterface[] {
      switch (this.filterRating) {
        case "":
          return state.products.sort((x, y) => x.id - y.id);
        case "Under 3":
          return state.products.filter((product) => product.average_product_rating < 3);
        case "between 3 and 3.8":
          return state.products.filter(
            (product) => product.average_product_rating >= 3 && product.average_product_rating < 3.8
          );
        case "between 3.8 and 4.5":
          return state.products.filter(
            (product) => product.average_product_rating >= 3.8 && product.average_product_rating < 4.5
          );
        default:
          return state.products.filter((product) => product.average_product_rating >= 4.5);
      }
    },

    getProductsSearch(state: productState): ProductInterface[] {
      return state.products.filter(
        (product) =>
          product.sku.toUpperCase().indexOf(this.searchName.toUpperCase()) > -1 ||
          product.name.toUpperCase().indexOf(this.searchName.toUpperCase()) > -1 ||
          product.description.toUpperCase().indexOf(this.searchName.toUpperCase()) > -1 ||
          product.list_price.toString().toUpperCase().indexOf(this.searchName.toUpperCase()) > -1 ||
          product.category.toUpperCase().indexOf(this.searchName.toUpperCase()) > -1 ||
          product.average_product_rating.toString().toUpperCase().indexOf(this.searchName.toUpperCase()) > -1 ||
          product.brand.toUpperCase().indexOf(this.searchName.toUpperCase()) > -1
      );
    },
    getProductById: (state) => (productId: number) => {
      const product = state.products.find((p) => p.id === productId);
      return product || null; // Return the product if found, return null
    },

    getsaleProducts(state: productState): ProductInterface[] {
      return state.saleProducts.slice(20, 24);
    },

    hours(): string {
      return String(Math.floor(this.countdown / 3600)).padStart(2, "0");
    },
    minutes(): string {
      return String(Math.floor((this.countdown % 3600) / 60)).padStart(2, "0");
    },
    seconds(): string {
      return String(this.countdown % 60).padStart(2, "0");
    },
    formattedTime(): string {
      return `${this.hours}:${this.minutes}:${this.seconds}`;
    },
  },
  actions: {
    async fetchProducts() {
      await new Promise((resolve) => setTimeout(resolve, 500));

      this.products = products;
    },

    sortByPrice() {
      this.sortPrice = true;
      this.sortRating = false;
      this.direction = false;

      this.filterCategory = "";
      this.filterPrice = "";
      this.filterBrand = "";
      this.filterRating = "";
      this.searchName = "";
    },
    sortByRating() {
      this.sortRating = true;
      this.sortPrice = false;
      this.direction = false;

      this.filterCategory = "";
      this.filterPrice = "";
      this.filterBrand = "";
      this.filterRating = "";
      this.searchName = "";
    },

    toggleSortDirection() {
      this.direction = !this.direction;
    },

    startCountdown() {
      const interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
          this.saveToLocalStorage();
        } else {
          clearInterval(interval);
          this.saleProducts = [];
          this.saveToLocalStorage();
        }
      }, 1000);
    },
    saveToLocalStorage() {
      localStorage.setItem("countdown", this.countdown.toString());
      localStorage.setItem("saleProducts", JSON.stringify(this.saleProducts));
    },

    toggleSaleProductsVisibility() {
      this.show = !this.show;
    },
  },
});
