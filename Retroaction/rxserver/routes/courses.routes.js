import express from 'express';
const router = express.Router();
import {
  createCourse,
  getAUCourses,
  getPopulatedCourse,
  getDepartmentsCourse,
  deleteCourse,
  updateCourse,
} from "../controllers/courses.controller.js";
import { Permission, hasPermission } from "../middlewares/auth.middleware.js";

// all auth users
router.get("/", getAUCourses);
router.get("/:courseId", getPopulatedCourse);

// Admin and Coordinator
router.use(hasPermission([Permission.admin, Permission.coordinator]));
router.get("/departments/:departmentId", getDepartmentsCourse);
router.post("/", createCourse);
router.patch("/:courseId", updateCourse);
router.delete("/:courseId", deleteCourse);

export default router;