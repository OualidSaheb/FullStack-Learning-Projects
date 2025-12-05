import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  numberAddress: { type: Number },
  streetAddress: { type: String },
  postCode: { type: String },
});

export default mongoose.model("Address", addressSchema);
