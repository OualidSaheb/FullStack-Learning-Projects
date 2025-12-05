import express from 'express';
const router = express.Router();
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "../controllers/departments.controller.js";
import { Permission, hasPermission } from "../middlewares/auth.middleware.js";

// Admin
// ********** Retiré les permissions pour travailler avec le coordo en developpement **********
// router.use(hasPermission([Permission.admin]));
router.get("/", getDepartments);
router.post("/", createDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;
