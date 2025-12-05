import mongoose from "mongoose";
import { System } from "./index.js";
import { v4 as uuid } from 'uuid';

const levelSchema = mongoose.Schema({
  _id: { type: String, default: uuid },
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

export const Level = mongoose.model("Level", levelSchema);

const criterionSchema = mongoose.Schema({
  _id: { type: String, default: uuid },
  title: {
    type: String,
    required: true,
  },
  levels: [levelSchema],
  note: { type: String, default: "", },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }});

criterionSchema.virtual("weight").get(function () {
  return this.levels ? Math.max(...this.levels.map((level) => level.value)) : 0;
});

export const Criterion = mongoose.model("Criterion", criterionSchema);

const sectionSchema = mongoose.Schema({
  _id: { type: String, default: uuid },
  title: {
    type: String,
    required: true,
  },
  criteria: [criterionSchema],
  note: { type: String, default: "", },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }});

export const Section = mongoose.model("Section", sectionSchema);

export const gridSchema = mongoose.Schema(
  {
    _id: { type: String, default: uuid },
    title: {
      type: String,
      required: true,
    },
    sections: [sectionSchema],
    code: { type: Number, require: true, unique: true },
    course: {
      type: String,
      ref: "Course",
      required: true,
    },
    note: { type: String, default: "", },
    state: {
      type: String,
      enum: ["active", "archived"],
      default: "active"
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, discriminatorKey: 'kind'}
);

gridSchema.virtual("type").get(() => "grid");

gridSchema.pre("validate", async function (next) {
  if (this.isNew && !this.code) {
    const system = await System.findOne({ }); //TODO: Find the system according to organisation
    this.code = system.nextGridCode++;
    await system.save();
  }
  next();
});

export const Grid = mongoose.model("Grid", gridSchema);

export const UserGrid = Grid.discriminator(
  "UserGrid",
  new mongoose.Schema({
    teacher: { type: String, ref: "Teacher", required: true },
    source: { type: String, ref: "Grid" },
  })
);
