import mongoose from "mongoose";
import { logger } from "../middlewares/logger.middleware.js";
import { i18n } from "../middlewares/i18n.middleware.js";

const protocol = process.env.DATABASE_PROTOCOL ?? "";
const cluster = process.env.DATABASE_CLUSTER ?? "";
const params = process.env.DATABASE_PARAMS ?? "";
const username = process.env.DATABASE_USERNAME ? process.env.DATABASE_USERNAME + ":" : "";
const password = process.env.DATABASE_PASSWORD ?? "";
const database = process.env.DATABASE_NAME ?? "";
const port = process.env.DATABASE_PORT ? ":" + process.env.DATABASE_PORT : "";

export const connectionString = `${protocol}://${username}${password}@${cluster}${port}/${database}${params}`;
console.log(connectionString);
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

export const connect = (callback) =>
  mongoose
    .connect(connectionString, options)
    .then((db) => {
      logger.info(i18n.__("DATABASE_CONNECTED", { database, cluster }));
      if (callback) callback(db);
    })
    .catch((err) => {
      logger.error(err);
      console.log(err);
    });