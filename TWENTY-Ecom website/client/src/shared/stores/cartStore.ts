import { defineStore } from "pinia";
import { CartInterface } from "@/shared/interfaces/cart.interface";
import type { ProductInterface } from "@/shared/interfaces/product.interface";
import { createCart, getUserCarts, deleteCart, updateQuantity } from "../services/cart.service"; // Adjust the import path
import { log } from "console";

export interface CartState {
  carts: CartInterface[];
  // Pour toggle la visibilité
  show: boolean;
}

export interface CartState {
  carts: CartInterface[];
  show: boolean;
  error: any;
  isConnected: boolean;
}

export const useCart = defineStore("cart", {
  state: (): CartState => ({
    carts: [],
    show: false,
    error: null,
    isConnected: localStorage.getItem("isConnected") === "true",
  }),

  getters: {
    getCartItemsFormatted(): CartInterface[] {
      return this.carts;
    },
    /*getCartItemsFormatted(state) {
      return state.carts.map((item) => {
        
        // Check if item.product exists before accessing its properties
        if (item.product) {
          return {
            product: {
              id: item.product.id,
              sku: item.product.sku,
              name: item.product.name,
              list_price: item.product.list_price,
              sale_price: item.product.sale_price,
              image_url: item.product.image_url,
            },
            quantity: item.quantity,
            currentPrice: item.currentPrice,
          };
        } else {
          // Handle the case where item.product is undefined
          // You can return a default product object or take other appropriate action
          return {
            product: {
              id: -1, // or some default ID
              sku: "N/A",
              name: "Product Not Found",
              list_price: 0,
              sale_price: 0,
              image_url: "default-image.jpg",
            },
            quantity: item.quantity,
            currentPrice: item.currentPrice,
          };
        }
      });
    },
*/
    getSubtotal(): string {
      return this.carts.reduce((acc, item) => acc + item.currentPrice * item.quantity, 0).toFixed(2);
    },

    getGst(): string {
      return (Number(this.getSubtotal) * 0.05).toFixed(2);
    },

    getQst(): string {
      return (Number(this.getSubtotal) * 0.0975).toFixed(2);
    },

    getTotal(): string {
      return (
        (Number(this.getSubtotal) + Number(this.getGst) + Number(this.getQst))
          // + (this.getFreeShipping ? 0 : 15)
          .toFixed(2)
      );
    },
    getTotalQuantity(): number {
      return this.carts.reduce((acc, item) => acc + item.quantity, 0);
    },
    getFreeShipping(): boolean {
      return Number(this.getSubtotal) > 200;
    },
  },
  

  actions: {
    
    async fetchUserCarts() {
      try {
        if (this.isConnected) {
          console.log(this.isConnected);

          console.log("Fetching user carts...");
          this.carts = await getUserCarts();
          console.log("Carts fetched successfully:", this.carts);
          this.error = null;
        }
      } catch (error) {
        console.error("Error fetching user carts:", error);
        this.error = error;
      }
    },

    

    async addCart(cartData: {
      id: number;
      quantity: number;
      currentPrice: number;
      sku: string;
      name: string;
      sale_price: number;
      image_url: string;
      list_price: number;
    }) {
      try {
        console.log("Before adding to cart:", this.carts);

        if (this.isConnected) {
          // If connected, create a new cart item
          const newCart = await createCart(cartData);

          if (newCart) {
            this.carts.push(newCart);
            console.log("After adding to cart:", this.carts);
            this.error = null;
            return newCart; // Return the newly created cart data
          } else {
            throw new Error("Cart creation failed"); // Handle creation failure
          }
        } else {
          const cartToAdd: CartInterface = {
            // Initialize cartToAdd with cartData
            product: {
              id: cartData.id,
              sku: cartData.sku,
              name: cartData.name,
              sale_price: cartData.sale_price,
              image_url: cartData.image_url,
              list_price: cartData.list_price,
            },
            quantity: cartData.quantity,
            currentPrice: cartData.currentPrice,
          };
          const existingItem = this.carts.find((item) => item.product.id === cartToAdd.product.id);

          if (existingItem) {
            existingItem.quantity++;
          } else {
            this.carts.push(cartToAdd);
          }
          console.log("After adding to cart (not connected):", this.carts);
          this.error = null;
          return cartData; // Return the cart data
        }
      } catch (error) {
        this.error = error;
        throw error; // Rethrow the error for handling in the component
      }
    },
   
    updateQuantity(id: number, quantity: number) {
      const item = this.carts.find((item) => item.product.id === id);

      if (item) item.quantity = quantity;
    },

    async removeCart(index: number) {
      try {
        if (this.isConnected) {
          await deleteCart(index);
        }
        if (index > -1) this.carts.splice(index, 1);
        this.error = null;
      } catch (error) {
        this.error = error;
      }
    },

    toggleCartVisibility() {
      this.show = !this.show;
    },
    updateCartItems(newCartItems: CartInterface[]) {
    
      this.carts = newCartItems;
    },
    async login() {
      this.isConnected = true;
      localStorage.setItem("isConnected", "true");
    },

    async logout() {
      this.isConnected = false;
      localStorage.setItem("isConnected", "false");
    },
  },
});
