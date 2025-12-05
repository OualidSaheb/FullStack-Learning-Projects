import mongoose from "mongoose";
import { System } from "./index.js";
import { v4 as uuid } from 'uuid';

/* const messageSchema = mongoose.Schema({
  _id: { type: String, default: uuid },
  user: { type: String, ref: "User", required: true },
  content: {
    type: String,
    default: ""
  }
}); */

const resultSchema = mongoose.Schema(
  {
    _id: { type: String, default: uuid },
    criterion: { type: String, ref: "Criterion", required: true },
    selection: { type: String, ref: "Level", default: null },
    note: { type: String, default: "", },
    value: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      enum: ["active", "archived"],
      default: "active"
    },
    comment: {
      type: String,
      default: null,
    },
    audioUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: false }
);

export const Result = mongoose.model("Result", resultSchema);

const correctionSchema = mongoose.Schema(
  {
    _id: { type: String, default: uuid },
    student: { type: String, ref: "Student", required: true },
    results: [resultSchema],
    preresults: [resultSchema],
    /*     state: {
      type: String,
      enum: ["active", "completed"],
      default: "active"
    }, */
    note: { type: String, default: "", },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const Correction = mongoose.model("Correction", correctionSchema);

const evaluationSchema = mongoose.Schema(
  {
    _id: { type: String, default: uuid },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    state: {
      type: String,
      enum: ["created", "started", "completed", "submited", "closed"],
      default: "created"
    },
    published :  {
      type: Boolean,
      required: true,
      default: false,
    },
    classroom: { type: String, ref: "Classroom", required: true },
    //grid type sera in ObjectID lié à la Grille sélectionnée lorsque "created" & "published"
    //Lors du démarrage de l'évaluation "started" stoquera une copie de la grille.
    grid: { type: mongoose.Schema.Types.Mixed, ref: "Grid", required: true },
    //sourceGrid: { type: String, required: true, ref: "Grid" },
    //effectiveGrid: { gridSchema },
    corrections: [correctionSchema],
    note: { type: String, default: "", },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }  }
);

evaluationSchema.pre('findOneAndUpdate', function(next) {
  console.log("rentre dans le pre() findOneAndUpdate");
  //if (this.state === 'created') {
  //  this._update.$set.grid = this._update.$set.grid._id;
  //}
  next();
});

evaluationSchema.pre("validate", async function (next) {
  if (this.isNew && !this.code) {
    const system = await System.findOne({ }); //TODO : Find a way to work with multiple organisations
    this.code = system.nextEvaluationCode++;
    await system.save();
  }
  next(); 
});

evaluationSchema.virtual("type").get(()=> "evaluation");

export const Evaluation = mongoose.model("Evaluation", evaluationSchema);
