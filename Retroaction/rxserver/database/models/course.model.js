import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';

const schema = mongoose.Schema(
  {
    _id: { type: String, default: uuid },
    department: { type: String, ref: "Department", required: true },
    code: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 3,
    },
    title: {
      type: String,
    },
    note: { type: String, default: "", },
    state: {
      type: String,
      enum: ["active", "archived"],
      default: "active"
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.virtual("type").get(()=> "course");

export default mongoose.model("Course", schema);
