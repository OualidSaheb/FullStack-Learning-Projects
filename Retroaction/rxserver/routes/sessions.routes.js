import express from 'express';
const router = express.Router();
import {
  createSession,
  getSessions,
  updateSession,
  deleteSession,
} from "../controllers/sessions.controller.js";
import { Permission, hasPermission } from "../middlewares/auth.middleware.js";

// all auth users
router.get("/", getSessions);

// Admin and Coordinator
router.use(hasPermission([Permission.admin, Permission.coordinator]));

router.post("/", createSession);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

export default router;