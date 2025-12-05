import { CardInterface } from "../interfaces/card.interface";
import axios from "axios";

const BASE_URL = "/api/users/card";

export async function createCard(data: CardInterface) {
  const response = await axios.post(BASE_URL, data);
  if (!response.data.error) {
    return response.data;
  } else {
    throw new Error("Erreur dans Create Card");
  }
}

export async function deleteCard(indexCard: number): Promise<void> {
  await axios.delete(`${BASE_URL}/${indexCard}`);
}

export async function editCard(index: number, data: CardInterface) {
  try {
    await axios.patch(`${BASE_URL}/${index}`, data);
  } catch (error) {
    throw new Error("Error updating user card: " + error);
  }
}

export async function getUserCards(): Promise<CardInterface[]> {
  const response = await axios.get(BASE_URL);
  if (!response.data?.error) {
    return response.data || [];
  } else {
    throw new Error("Erreur dans get card user " + response.data.error);
  }
}
