import jsonwebtoken from "jsonwebtoken";
import { findUserByIDQuery } from "../database/queries/users.queries.js";
import { i18n } from "./i18n.middleware.js";

export const Permission = {
  admin: "admin",
  coordinator: "coordinator",
  teacher: "teacher",
  student: "student",
};

export const fetchUserFromToken = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (auth) {
      const token = auth.split(" ")[1];
      const decoded = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
      req.user = await findUserByIDQuery(decoded.sub).exec();

      if (req.user) {
        next();
      } else {
        res.status(403).json({ error: i18n.__("TOKEN_INVALID") });
      }
    } else {
      res.status(403).json({ error: i18n.__("TOKEN_INVALID") });
    }
  } catch (e) {
    next(e);
  }
};

export const hasPermission = (roles) => (req, res, next) =>
  roles.includes(Permission.admin) && req.user.isAdmin ||
  roles.includes(Permission.coordinator) && req.user.isCoordinator ||
  roles.includes(Permission.teacher) && req.user.kind === "Teacher" ||
  roles.includes(Permission.student) && req.user.kind === "Student"
    ? next()
    : res.status(403).json({ error: i18n.__("USER_NOT_AUTHORIZED") });