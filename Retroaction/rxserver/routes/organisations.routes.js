import express from 'express';
const router = express.Router();
import { createOrganisation, getOrganisations } from "../controllers/organisations.controller.js";
import { Permission, hasPermission } from "../middlewares/auth.middleware.js";

// Admin
router.use(hasPermission([Permission.admin]));
router.post("/", createOrganisation);
router.get("/", getOrganisations);

export default router;
