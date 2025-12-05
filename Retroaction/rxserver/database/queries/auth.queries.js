import { User } from "../models/index.js";
import { findUserByEmailQuery, updateUserStateQuery } from "./users.queries.js";
import { i18n } from "../../middlewares/i18n.middleware.js";
import jsonwebtoken from "jsonwebtoken";
/* import find from "../models/system.model";
import findOne from "../models/student.model"); */

export const sessionCreateQuery = async (data) => {
  const user = await findUserByEmailQuery(data.email);

  if (!user) throw new Error(i18n.__("USER_NOT_FOUND_OR_INVALID_PASSWORD"));
  const match = true; //await user.comparePassword(data.password);

  if (!match) throw new Error(i18n.__("USER_NOT_FOUND_OR_INVALID_PASSWORD"));
  const token = jsonwebtoken.sign(
    {
      sub: user._id.toString(),
      expiresIn: process.env.TOKEN_EXPIRESIN,
    },
    process.env.TOKEN_SECRET,
    { algorithm: "HS256" }
  );
  if (!token) throw Error(i18n.__("TOKEN_CREATE_FAILED"));

  return { user, token };
};

export const updateUserPasswordQuery = async (data) => {
  const user = await findUserByEmailQuery(data.email);
  if (!user) throw new Error(i18n.__("CREDENTIALS_NOT_FOUND"));
  if (user.resetPassToken !== data.resetPassToken) throw new Error(i18n.__("CREDENTIALS_NOT_FOUND"));

  const newPassword = data.newPassword;
  if (newPassword?.length < 1) throw new Error(i18n.__("PASSWORD_INVALID"));
  const newHashPassword = await User.hashPassword(newPassword);
  user.local.password = newHashPassword;
  user.resetPassToken = null;
  await updateUserStateQuery(user._id, "active");
  await user.save();
  return user;
};
