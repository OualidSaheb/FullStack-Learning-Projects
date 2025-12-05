import express from "express";
const router = express.Router();

import usersRouter from "./users.routes.js";
import authRouter from "./auth.routes.js";

router.use("/api/users", usersRouter);
router.use("/api/auth", authRouter);

export default router;
