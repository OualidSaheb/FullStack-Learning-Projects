import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';

const schema = mongoose.Schema(
  {
    _id: { type: String, default: uuid },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    //TODO : ajouter un validateur pour le domaine
    },
    // logo: {
    //   type: String,
    //   // required: true,
    // },
    note: { type: String, default: "", },
    state: {
      type: String,
      enum: ["active", "archived"],
      default: "active"
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }  }
);

schema.virtual("type").get(()=> "organisation");

export default mongoose.model("Organisation", schema);
