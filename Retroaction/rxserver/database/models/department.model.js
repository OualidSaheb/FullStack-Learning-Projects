import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';

const schema = mongoose.Schema(
  {
    _id: { type: String, default: uuid },
    organisation: {type: String, ref: "Organisation", required: true},
    code: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true
    },
    note: { type: String, default: "", },
    state: {
      type: String,
      enum: ["active", "archived"],
      default: "active"
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }  }
);

schema.virtual("type").get(()=> "department");

export default mongoose.model("Department", schema);
