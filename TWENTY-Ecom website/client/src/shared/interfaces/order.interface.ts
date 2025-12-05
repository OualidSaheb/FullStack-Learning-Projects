import { CartInterface } from "./cart.interface";

export const enum cardType {
  creditCard,
  giftCard,
}

export interface PaymentCardInerface {
  type: string;
  cardNumber: string;
}

export interface OrderInterface {
  email: string;
  name: string;
  address: string;
  lines: CartInterface[];
  subtotal: number;
  gst: number;
  qst: number;
  total: number;
  
  paymentMethod: PaymentCardInerface;
}
