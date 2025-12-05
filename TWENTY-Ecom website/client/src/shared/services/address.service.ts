import { AddressInterface } from "../interfaces/address.interface";
import axios from "axios";

const BASE_URL = "/api/users/address";

export async function createAddress(data: AddressInterface) {
  const response = await axios.post(BASE_URL, data);
  if (!response.data.error) {
    return response.data;
  } else {
    throw new Error("Erreur dans sign-in");
  }
}

export async function deleteAddress(indexAddress: number): Promise<void> {
  await axios.delete(`${BASE_URL}/${indexAddress}`);
}

export async function editAddress(index: number, data: AddressInterface) {
  try {
    await axios.patch(`${BASE_URL}/${index}`, data);
  } catch (error) {
    throw new Error("Error updating user address: " + error);
  }
}

export async function getUserAddresses(): Promise<AddressInterface[]> {
  const response = await axios.get(BASE_URL);
  if (!response.data?.error) {
    return response.data || []; 
  } else {
    throw new Error("Erreur dans get address user " + response.data.error);
  }
}