import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    organisation: { type: String, ref: "Organisation", required: true, unique: true },
    nextGridCode: {
      type: Number,
      required: true,
      default: 1001,
    },
    nextEvaluationCode: {
      type: Number,
      required: true,
      default: 1001,
    },
    nextClassroomCode: {
      type: Number,
      required: true,
      default: 1001,
    },
    currentSession: { type: String, ref: "Session", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }  }
);

schema.virtual("type").get(()=> "system");

export default mongoose.model("System", schema);
