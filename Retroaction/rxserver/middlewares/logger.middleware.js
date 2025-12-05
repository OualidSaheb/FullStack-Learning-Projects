import winston from "winston";

const errorFile = process.env.LOGGER_ERROR ?? "./log/error.log";
const combinedFile = process.env.LOGGER_COMBINED ?? "./log/combined.log";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: errorFile, level: "error" }),
    new winston.transports.File({ filename: combinedFile }),
  ],
});

export const log = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};

export const errors = (err, req, res, next) => {
  logger.error(`${req.method} ${req.url} ${err.stack}`);
  next();
};