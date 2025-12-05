import {
  createCard as createCardQuery,
  deleteCard as deleteCardQuery,
  getUserCards as getUserCardsQuery,
} from "../queries/cards.queries.js";

import Card from "../database/models/card.model.js";
import User from "../database/models/user.model.js";

// Create a new card for the user
export const createCards = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const cardData = req.body;

    const newCards = await createCardQuery(userId, cardData);

    res.json({ message: "Cards created successfully", card: newCards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserCards = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const cards = await getUserCardsQuery(userId);

    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editCard = async (req, res, next) => {
  try {
    const { cardIndex } = req.params;
    const userId = req.user.userId;
    const updatedData = req.body;

    // Find the user by their ID
    const user = await User.findById(userId); // Assuming you have a User model

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the card index is within bounds
    if (cardIndex < 0 || cardIndex >= user.cards.length) {
      return res.status(400).json({ error: "Invalid card index" });
    }

    // Get the card by its index
    const cardToUpdate = await Card.findById(user.cards[cardIndex]);

    if (!cardToUpdate) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Update card fields with new data
    if (updatedData.nameOnCard) {
      cardToUpdate.nameOnCard = updatedData.nameOnCard;
    }
    if (updatedData.cardNumber) {
      cardToUpdate.cardNumber = updatedData.cardNumber;
    }
    if (updatedData.expiration) {
      cardToUpdate.expiration = updatedData.expiration;
    }
    if (updatedData.CVC) {
      cardToUpdate.CVC = updatedData.CVC;
    }

    // Save the updated card document
    await cardToUpdate.save();

    await user.save();

    console.log("Card updated successfully");
    res.json({ message: "Card updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an card by its index for the user
export const deleteCard = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { cardIndex } = req.params; // Assuming you pass the index as a URL parameter
  
      const message = await deleteCardQuery(userId, cardIndex);
  
      res.json({ message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
