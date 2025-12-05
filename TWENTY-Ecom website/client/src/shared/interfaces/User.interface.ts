import { AddressInterface } from './address.interface';
import { CardInterface } from './card.interface';
import { PaymentCardInerface, OrderInterface } from "./order.interface";

export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  addresses: AddressInterface[];
  cards: CardInterface[];
  orders: OrderInterface[];
}

export type UserFormInterface = Partial<UserInterface>;

export interface SigninFormInterface {
  password: string;
  email: string;
}
