import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    nameOnCard: { type: String },
    cardNumber: { type: String },
    expiration: { type: String },
    CVC: { type: String },
  });

  export default mongoose.model("Card", cardSchema);
