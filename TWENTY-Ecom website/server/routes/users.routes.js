import express from "express";
const router = express.Router();

import { signup, fetchCurrentUser, deleteUser, updateUser, authenticate } from "../controllers/users.controller.js";

import { createAddress, deleteAddress, editAddress, getUserAddresses } from "../controllers/address.controller.js";

import { createCards, getUserCards, editCard, deleteCard } from "../controllers/cards.controller.js";
import { addtoCart, getCart, deleteProductCart,updateCartQuantity } from "../controllers/cart.controller.js";
import { addOrder, delOrder, getUserOrders } from "../controllers/users.controller.js";
//import { getUserOrders } from "../controllers/order.controller.js";

router.post("/", signup);
router.get("/", fetchCurrentUser);
router.delete("/", deleteUser);
router.patch("/", authenticate, updateUser);

router.post("/address", authenticate, createAddress);
router.delete("/address/:addressIndex", authenticate, deleteAddress);
router.patch("/address/:addressIndex", authenticate, editAddress);
router.get("/address", authenticate, getUserAddresses);

router.post("/card", authenticate, createCards);
router.get("/card", authenticate, getUserCards);
router.patch("/card/:cardIndex", authenticate, editCard);
router.delete("/card/:cardIndex", authenticate, deleteCard);

router.post("/cart", authenticate, addtoCart);
router.get("/cart", authenticate, getCart);
router.delete("/cart/:cartIndex", authenticate, deleteProductCart);
router.patch("/cart", authenticate, updateCartQuantity);

router.post("/orders", addOrder);
router.get("/orders", authenticate, getUserOrders);
router.delete("/orders", delOrder);

export default router;
