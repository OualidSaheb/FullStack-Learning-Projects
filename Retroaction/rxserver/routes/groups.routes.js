import express from 'express';
const router = express.Router();
import {
  createGroup,
  getGroups,
  getPopulatedGroup,
  deleteOneGroup,
  updateGroup,
  addStudentToGroup,
  deleteStudentFromGroup,
  /*addStudents,*/
} from "../controllers/groups.controller.js";
import { Permission, hasPermission } from "../middlewares/auth.middleware.js";

// Admin and Coordinator
router.use(hasPermission([Permission.admin, Permission.coordinator]));
router.get("/", getGroups);
router.get("/:groupId", getPopulatedGroup);
router.post("/", createGroup);
router.delete("/:groupId", deleteOneGroup);
router.put("/:groupId", updateGroup);
router.post("/:groupsId/student/:userId", addStudentToGroup);
router.delete("/:groupsId/student/:userId", deleteStudentFromGroup);

export default router;

