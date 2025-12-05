import mongoose from "mongoose";
import { System } from "./index.js";
import { v4 as uuid } from 'uuid';

const schema = mongoose.Schema(
  {
    _id: { type: String, default: uuid },
    organisation: { type: String, ref: "Organisation", required: false },
    code: { type: String, required: true, unique: true },
    session: { type: String, ref: "Session", required: true },
    course: { type: String, ref: "Course", required: true },
    group: { type: String, ref: "Group", required: true },
    students: [{ type: String, ref: "Student" }],
    teachers: [{ type: String, ref: "Teacher" }],
    note: { type: String, default: "", },
    state: {
      type: String,
      enum: ["active", "archived"],
      default: "active"
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.pre("validate", async function (next) {
  if (this.isNew && !this.code) {
    const system = await System.findOne({ });
    this.code = system.nextClassroomCode++;
    await system.save();
  }
  next();
});

/* schema.pre("validate", async function () {
  const { Session, Course, Group } = require("./index.js");

  const sessionPromise = Session.findById(this.session);
  const coursePromise = Course.findById(this.course);
  const groupPromise = Group.findById(this.group);

  const [session, course, group] = await Promise.all([sessionPromise, coursePromise, groupPromise]);
  this.title = `${session.code}-${course.code}-${group.code}`;
}); */

schema.virtual("type").get(()=> "classroom");

export default mongoose.model("Classroom", schema);
