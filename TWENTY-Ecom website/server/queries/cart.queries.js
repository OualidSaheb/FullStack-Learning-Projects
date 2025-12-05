import User from "../database/models/user.model.js";
import Cart from "../database/models/cart.model.js";

export const addProductToCart = async (userId, id, quantity, currentPrice, sku, name, sale_price, image_url, list_price) => {
    try {
        // Find the user based on their user ID
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Use await to find existing carts for the user
        const existingCarts = await Cart.find({
            "product.id": id,
        });

        if (existingCarts.length > 0) {
            // If there are existing carts with the same product ID, update the quantity of the first one
            const existingCart = existingCarts[0];
            existingCart.quantity = parseInt(existingCart.quantity) + parseInt(quantity);
            await existingCart.save();
        } else {
            // Create a new cart for the user
            const newCart = new Cart({
                product: {
                    id,
                    sku,
                    name,
                    list_price,
                    sale_price,
                    image_url,
                },
                quantity: quantity,
                currentPrice: currentPrice,
            });

            // Save the new cart
            await newCart.save();

            user.carts.push(newCart);
        }

        // Save the updated user document
        await user.save();

        //return newCart;
        return "Product added to cart successfully";
    } catch (error) {
        throw error;
    }
};

export const updateQuantity = async (userId, cartIndex) => {
    try {
        // Find the user based on their user ID
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Use await to find existing carts for the user
        const existingCarts = await Cart.find({
            "product.id": id,
        });

        if (existingCarts.length > 0) {
            // If there are existing carts with the same product ID, update the quantity of the first one
            const existingCart = existingCarts[0];
            existingCart.quantity = parseInt(existingCart.quantity) + parseInt(quantity);
            await existingCart.save();
        } 

        // Save the updated user document
        await user.save();

        //return newCart;
        return "Product updated to cart successfully";
    } catch (error) {
        throw error;
    }
};

// Function to get the user's carts
export const getUserCarts = async (userId) => {
    try {
        // Find the user based on their user ID
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Populate the carts with product details
        const carts = await Cart.find({ _id: { $in: user.carts } });

        return carts;
    } catch (error) {
        throw error;
    }
};

export const deleteCart = async (userId, cartIndex) => {
    try {
        // Find the user by their ID
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Check if the cart index is within bounds
        if (cartIndex < 0 || cartIndex >= user.carts.length) {
            throw new Error("Invalid cart index");
        }

        // Get the cart to be deleted
        const cartToDelete = user.carts[cartIndex];

        // Remove the cart from the user's carts array using splice
        user.carts.splice(cartIndex, 1);

        // Save the updated user document
        await user.save();

        // Delete the cart document from the database and return the deleted document
        const deletedDocument = await Cart.findByIdAndDelete(cartToDelete._id);

        if (!deletedDocument) {
            throw new Error("Cart not found in the database");
        }

        return deletedDocument;
    } catch (error) {
        throw error;
    }
};
