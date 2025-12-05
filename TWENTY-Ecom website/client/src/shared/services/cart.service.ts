import { CartInterface } from "../interfaces/cart.interface";
import axios from "axios";

const BASE_URL = "/api/users/cart";

export async function createCart(data: {
  id: number;
  quantity: number;
  currentPrice: number;
  sku: string;
  name: string;
  sale_price: number;
  image_url: string;
  list_price: number;
}): Promise<CartInterface> {
  const response = await axios.post(BASE_URL, data);
  if (!response.data.error) {
    return response.data;
  } else {
    throw new Error("Erreur dans sign-in");
  }
}

export async function updateQuantity(data: { id: number; quantity: number }): Promise<CartInterface> {
  const response = await axios.patch(BASE_URL, data);
  if (!response.data.error) {
    return response.data;
  } else {
    throw new Error("Erreur dans sign-in");
  }
}

export async function deleteCart(indexCart: number): Promise<void> {
  await axios.delete(`${BASE_URL}/${indexCart}`);
}

export async function getUserCarts(): Promise<CartInterface[]> {
  const response = await axios.get(BASE_URL);
  if (!response.data?.error) {
    return response.data || [];
  } else {
    throw new Error("Erreur dans get cart user " + response.data.error);
  }
}
