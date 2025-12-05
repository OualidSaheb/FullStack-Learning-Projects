import mongoose from "mongoose";
import User from "./user.model.js";
import { v4 as uuid } from 'uuid';

export default User.discriminator(
  "Student",
  new mongoose.Schema({
    code: {
      type: String,
      required: true,
      unique: true,
    },
    note: { type: String, default: "", },
    state: {
      type: String,
      enum: ["active", "archived"],
      default: "active"
    },
  }),
  
);
