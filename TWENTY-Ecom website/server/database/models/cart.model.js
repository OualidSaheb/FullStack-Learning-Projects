import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  product: {
    id: { type: Number },
    sku: { type: String },
    name: { type: String },
    list_price: { type: Number },
    sale_price: { type: Number },
    image_url: { type: String },
  },
  quantity: { type: Number },
  currentPrice: { type: Number },
});

export default mongoose.model("Cart", cartSchema);
