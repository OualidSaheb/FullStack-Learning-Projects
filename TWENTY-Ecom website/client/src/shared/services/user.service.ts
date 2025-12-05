import type { UserFormInterface, UserInterface } from "@/shared/interfaces/User.interface";
import axios from "axios";
import { OrderInterface } from "../interfaces/order.interface";

const BASE_URL = "/api/users";

export async function createUser(partialUser: UserFormInterface): Promise<UserInterface | null> {
  const response = await axios.post(BASE_URL, partialUser);
  if (!response.data.error) {
    return response.data;
  } else {
    throw new Error("Create user n'a pas fonctionné " + response.data.error);
  }
}

export async function fetchCurrentUser(): Promise<UserInterface | null> {
  const response = await axios.get(BASE_URL);
  if (!response.data?.error) {
    return response.data;
  } else {
    throw new Error("Erreur dans Fetch Current User " + response.data.error);
  }
}

export async function editUserProfile(updatedData: UserFormInterface) {
  try {
    await axios.patch(BASE_URL, updatedData);
  } catch (error) {
    throw new Error("Error updating user profile: " + error);
  }
}

export async function createOrder(order: OrderInterface): Promise<OrderInterface | null> {
  
  const response = await axios.post(BASE_URL+"/orders", order);
  
  if (!response.data.error) {
    
    return response.data;
  } else {
    throw new Error("Create order n'a pas fonctionné " + response.data.error);
  }
}

export async function fetchOrders(): Promise<OrderInterface[]> {
  
  const response = await axios.get(BASE_URL+"/orders");
  
  if (!response.data.error) {
    
    return response.data;
  } else {
    throw new Error("Create order n'a pas fonctionné " + response.data.error);
  }
}