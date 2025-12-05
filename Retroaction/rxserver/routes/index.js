import express from 'express';
const router = express.Router();
import apiRouter from "./api.routes.js";
import { i18n } from "../middlewares/i18n.middleware.js";

router.use("/api", apiRouter);
router.use("*", (req, res) => {
  res.status(404).send({ error: i18n.__("PAGE_NOT_FOUND ")});
});

export default router;