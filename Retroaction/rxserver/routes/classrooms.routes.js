import express from 'express';
const router = express.Router();
import {
  getPopulatedClassroom,
  getAUClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom,
} from "../controllers/classrooms.controller.js";
import { Permission, hasPermission } from "../middlewares/auth.middleware.js";

/* router.get("/", );
router.get("/class/:classId", ); */

// all auth users
router.get("/", getAUClassrooms);
router.get("/sessions/:sessionId", getAUClassrooms);
router.get("/:classroomId", getPopulatedClassroom);

// Admin and Coordinator
router.use(hasPermission([Permission.admin, Permission.coordinator]));
router.post("/create", createClassroom);
router.put("/update/:classroomId", updateClassroom);
router.delete("/delete/:classroomId", deleteClassroom);

export default router;