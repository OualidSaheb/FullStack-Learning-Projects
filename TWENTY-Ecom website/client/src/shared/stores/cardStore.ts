import { defineStore } from "pinia";
import { createCard, deleteCard, editCard, getUserCards } from "../services/card.service";
import type { CardInterface } from "@/shared/interfaces/card.interface";

interface CardState {
  cards: CardInterface[];
  cardDefault:string;
  error: any;
}

export const useCard = defineStore("card", {
  state: (): CardState => ({
    cards: [], // Initialize cards as an empty array
    error: null,
    cardDefault:""
  }),

  actions: {
    async createCard(cardData: CardInterface) {
      try {
        const newCard = await createCard(cardData);

        // Update the store
        this.error = null;
        this.cards.push(newCard);
      } catch (error) {
        this.error = error;
      }
    },

    async getUserCards() {
      try {
        const cards = await getUserCards();
        this.cards = cards;
        this.cardDefault=cards[0].cardNumber
        this.error = null;
      } catch (error) {
        this.error = error;
      }
    },

    async deleteCard(indexCard: number) {
      try {
        // Use the axios function to delete the card
        await deleteCard(indexCard);
    
        // Update the cards in the store by filtering out the deleted card
        this.cards = this.cards.filter((card, index) => index !== indexCard);
        this.error = null;
      } catch (error) {
        this.error = error;
      }
    },

    async editCard(index: number, cardData: CardInterface) {
      try {
        await editCard(index, cardData);
        // Update the cards in the store (assuming the response from the server includes the updated card)
        this.cards = this.cards.map((card) => {
          if (card._id === cardData._id) {
            return cardData;
          }
          return card;
        });
      } catch (error) {
        this.error = error;
      }
    },
    getCardFormated(n: number): string {
      
      return this.cards[n].cardNumber;
    },
  },
});
