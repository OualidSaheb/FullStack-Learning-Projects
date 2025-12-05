import User from "../database/models/user.model.js";
import Card from "../database/models/card.model.js";

export const createCard = async (userId, cardData) => {
  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Create a new card document
    const newCard = new Card({
      nameOnCard: cardData.nameOnCard,
      cardNumber: cardData.cardNumber,
      expiration: cardData.expiration,
      CVC: cardData.CVC,
    });

    // Save the new card to the Card collection
    await newCard.save();

    // Add the new card to the user's cards array
    user.cards.push(newCard);

    // Save the updated user document
    await user.save();

    return newCard;
  } catch (error) {
    throw error;
  }
};

export const deleteCard = async (userId, cardIndex) => {
  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the card index is within bounds
    if (cardIndex < 0 || cardIndex >= user.cards.length) {
      throw new Error("Invalid card index");
    }

    // Get the card to be deleted
    const cardToDelete = user.cards[cardIndex];

    // Remove the card from the user's cards array using splice
    user.cards.splice(cardIndex, 1);

    // Save the updated user document
    await user.save();

    // Delete the card document from the database and return the deleted document
    const deletedDocument = await Card.findByIdAndDelete(
      cardToDelete._id
    );

    if (!deletedDocument) {
      throw new Error("Address not found in the database");
    }

    return deletedDocument;
  } catch (error) {
    throw error;
  }
};

export const getUserCards = async (userId) => {
  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Use the cards array to fetch the actual card documents
    const cards = await Card.find({ _id: { $in: user.cards } });

    return cards;
  } catch (error) {
    throw error;
  }
};
