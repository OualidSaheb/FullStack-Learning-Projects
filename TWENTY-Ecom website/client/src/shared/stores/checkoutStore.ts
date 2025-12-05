import { defineStore } from "pinia";
import { createOrder } from "@/shared/services/user.service";
import { PaymentCardInerface } from "@/shared/interfaces/order.interface";
import { OrderInterface } from "@/shared/interfaces/order.interface";

export interface CheckoutState {
  step: number;
  paymentMethod: PaymentCardInerface;
  order: OrderInterface | null | undefined;
  error: any;

  flagForModifyAddress: boolean;
  flagForModifyCard: boolean;
}

export const useCheckout = defineStore("checkout", {
  state: (): CheckoutState => ({
    step: 1,
    paymentMethod: {} as PaymentCardInerface,
    order: {} as OrderInterface,
    error: null,

    flagForModifyAddress: false,
    flagForModifyCard: false,
  }),
  actions: {
    toCheckoutShipping() {
      this.step = 1;
    },
    toCheckoutPayment() {
      this.step = 2;
    },
    toCheckoutReview() {
      this.step = 3;
    },

    toConfirmOrder() {
      this.step = 4;
    },

    addPaymentMethod(data: PaymentCardInerface) {},

    async createOrder(data: OrderInterface) {
      try {
        this.order = await createOrder(data);
        this.error = null;
      } catch (error) {
        this.order = undefined;
        this.error = error;
      }
    },
  },
});
