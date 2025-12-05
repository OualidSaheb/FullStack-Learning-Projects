import mongoose from "mongoose";
import Organisation from "./organisation.model.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from 'uuid';
import { i18n } from "../../middlewares/i18n.middleware.js";

const schema = mongoose.Schema(
  {
    _id: { type: String, default: uuid },
    organisation: {
      type: String,
      ref: "Organisation",
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    local: {
      email: { type: String, required: true, unique: true },
      password: { type: String, select: false },
    },
    isAdmin: { type: Boolean, required: true, default: false },
    resetPassToken: { type: String, default: "" },
    state: {
      type: String,
      enum: ["created", "pending", "active", "archived"],
      default: "created",
    },
    note: { type: String, default: "", },
  },
  { timestamps: true, discriminatorKey: "kind", toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

schema.statics.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

schema.methods.comparePassword = async function (password) {
  const user = await mongoose.model("User").findOne({ _id: this._id }).select("+local.password").exec();
  if (!user) {
    throw new Error(i18n.__("USER_NOT_FOUND", { userId: this._id }));
  }
  return await bcrypt.compare(password, user.local.password);
};

// code termporaire pour ajouter l'organisation (par default) dans les users qui n'en ont pas avec le seed
schema.pre("validate", async function (next) {
  if (!this.organisation) {
    const organisation = await Organisation.findOne();
    this.organisation = organisation ? organisation._id : null;
  }
  next();
});

schema.virtual("type").get(() => "user");

export default mongoose.model("User", schema);
