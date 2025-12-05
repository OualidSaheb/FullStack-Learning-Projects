import {
  addProductToCart,
  getUserCarts,
  deleteCart,
  updateQuantity,
} from "../queries/cart.queries.js";

export const addtoCart = async (req, res) => {
  try {
    const {
      id,
      quantity,
      currentPrice,
      sku,
      name,
      sale_price,
      image_url,
      list_price,
    } = req.body;
    const userId = req.user.userId;

    const result = await addProductToCart(
      userId,
      id,
      quantity,
      currentPrice,
      sku,
      name,
      sale_price,
      image_url,
      list_price
    );

    return res.status(200).json({ message: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const carts = await getUserCarts(userId);

    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteProductCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { cartIndex } = req.params; // Assuming you pass the index as a URL parameter

    const message = await deleteCart(userId, cartIndex);

    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateCartQuantity=async(req,res,next)=>{
  try {
    const userId = req.user.userId;
    const { cartIndex } = req.params; // Assuming you pass the index as a URL parameter

    const message = await updateQuantity(userId, cartIndex);

    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
