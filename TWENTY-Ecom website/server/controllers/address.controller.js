import {
  createAddress as createAddressQuery,
  deleteAddress as deleteAddressQuery,
  getUserAddresses as getUserAddressesQuery,
} from "../queries/address.queries.js";

import Address from "../database/models/address.model.js";
import User from "../database/models/user.model.js";

// Create a new address for the user
export const createAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const addressData = req.body;

    const newAddress = await createAddressQuery(userId, addressData);

    res.json({ message: "Address created successfully", address: newAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an address by its index for the user
export const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { addressIndex } = req.params; // Assuming you pass the index as a URL parameter

    const message = await deleteAddressQuery(userId, addressIndex);

    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editAddress = async (req, res, next) => {
  try {
    const { addressIndex } = req.params;
    const userId = req.user.userId;
    const updatedData = req.body;

    // Find the user by their ID
    const user = await User.findById(userId); // Assuming you have a User model

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the address index is within bounds
    if (addressIndex < 0 || addressIndex >= user.addresses.length) {
      return res.status(400).json({ error: "Invalid address index" });
    }

    
    // Get the address by its index
    const addressToUpdate = await Address.findById(user.addresses[addressIndex]);

    // Update address fields with new data
    if (updatedData.numberAddress) {
      addressToUpdate.numberAddress = updatedData.numberAddress;
    }
    if (updatedData.streetAddress) {
      addressToUpdate.streetAddress = updatedData.streetAddress;
    }
    if (updatedData.postCode) {
      addressToUpdate.postCode = updatedData.postCode;
    }

    // Save the updated address document
    await addressToUpdate.save();

    await user.save(); // Assuming you're saving the user, not just the address

    console.log("Address updated successfully");
    res.json({ message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserAddresses = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const addresses = await getUserAddressesQuery(userId);

    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
