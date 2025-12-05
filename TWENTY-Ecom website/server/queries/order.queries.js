import User from "../database/models/user.model.js";
import Order from "../database/models/order.model.js";
import Address from "../database/models/address.model.js";

export const createAddress = async (userId, addressData) => {
    try {
        // Find the user by their ID
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Create a new address document
        const newAddress = new Address({
            numberAddress: addressData.numberAddress,
            streetAddress: addressData.streetAddress,
            postCode: addressData.postCode,
        });

        // Save the new address to the Address collection
        await newAddress.save();

        // Add the new address to the user's addresses array
        user.addresses.push(newAddress);

        // Save the updated user document
        await user.save();

        return newAddress;
    } catch (error) {
        throw error;
    }
};

export const deleteAddress = async (userId, addressIndex) => {
    try {
        // Find the user by their ID
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Check if the address index is within bounds
        if (addressIndex < 0 || addressIndex >= user.addresses.length) {
            throw new Error("Invalid address index");
        }

        // Get the address to be deleted
        const addressToDelete = user.addresses[addressIndex];

        // Remove the address from the user's addresses array using splice
        user.addresses.splice(addressIndex, 1);

        // Save the updated user document
        await user.save();

        // Delete the address document from the database and return the deleted document
        const deletedDocument = await Address.findByIdAndDelete(addressToDelete._id);

        if (!deletedDocument) {
            throw new Error("Address not found in the database");
        }

        return deletedDocument;
    } catch (error) {
        throw error;
    }
};

export const getUserOrders = async (userId) => {
    try {
        // Find the user by their ID
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Use the addresses array to fetch the actual address documents
        //const s = await Address.find({ _id: { $in: user.addresses } });
        const orders = await Order.find({ _id: { $in: user.orders } });

        return orders;
    } catch (error) {
        throw error;
    }
};
