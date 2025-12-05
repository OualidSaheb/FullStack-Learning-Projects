import express from 'express';
const router = express.Router();
import {
  createGrid,
  createUserGrid,
  getGrid,
  updateGrid,
  deleteGrid,
  getCourseGrids,
  generateUserGrid,
  getClassroomGrids,
  createSection,
  getSection,
  updateSection,
  deleteSection,
  /*getGridSections,*/

  getGrids,
  updateGrids,

  updateCriterion,
  createCriterion,
  deleteCriterion,
  createLevel,
  deleteLevel,
  updateLevel,
} from "../controllers/grids.controller.js";
import { Permission, hasPermission } from "../middlewares/auth.middleware.js";

// all auth users except Student
router.use(hasPermission([Permission.admin, Permission.coordinator, Permission.teacher]));
// CRUD routes //
router.post("/", createGrid);
router.post("/user", createUserGrid);
router.post("/:gridId/section", createSection);
router.get("/:gridId", getGrid);
router.put("/:gridId", updateGrid);
router.delete("/:gridId", deleteGrid);
router.get("/course/:courseId", getCourseGrids);
router.post("/:gridId/generate-user-grid", generateUserGrid);
router.get("/classroom/:classroomId", getClassroomGrids);

export default router;
