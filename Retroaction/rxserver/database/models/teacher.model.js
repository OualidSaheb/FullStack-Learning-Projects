import mongoose from "mongoose";
import User from "./user.model.js";
import { v4 as uuid } from 'uuid';

const assignmentSchema = mongoose.Schema({
  _id: false,
  department: { type: String, ref: "Department", required: true },
  isCoordinator: {
    type: Boolean,
    default: false,
    required: true
  }
});

const teacherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  department: { type: String, ref: "Department", required: true },
  assignments: [assignmentSchema],
});


teacherSchema.virtual('isCoordinator').get(function() {
  return true;
});

export default User.discriminator(
  "Teacher", teacherSchema, { toJSON: { virtuals: true }, toObject: { virtuals: true }}
);
