import express from 'express';
const router = express.Router();

import {
  createEvaluation,
  getEvaluations,
  getPopulatedEvaluation,
  closeEvaluation,
  updateEvaluation,
  updateCorrection,
  getCourseEvaluations,
  updateEvaluationState,
  deleteEvaluation,
  startEvaluation,
  getStudentClassroomCorrections,
  getClassroomEvaluations,
  getCorrection,
  getGroupCorrections,
  getEvaluationGrid
} from "../controllers/evaluations.controller.js";
import { Permission, hasPermission } from "../middlewares/auth.middleware.js";

// all auth users
router.use(hasPermission([Permission.admin, Permission.coordinator, Permission.teacher, Permission.student]));
router.get("/corrections/classrooms/:classroomId/", getStudentClassroomCorrections);

// all auth users except Student
router.use(hasPermission([Permission.admin, Permission.coordinator, Permission.teacher]));
router.post("/", createEvaluation);
router.patch("/:evaluationId/start", startEvaluation);
router.get("/", getEvaluations);
router.get("/courses/:courseId", getCourseEvaluations);
router.get("/classrooms/:classroomId", getClassroomEvaluations);
router.get("/corrections/groups/:groupId", getGroupCorrections);
router.get("/:evaluationId", getPopulatedEvaluation);
router.get("/:evaluationId/grid", getEvaluationGrid);
router.get("/:evaluationId/corrections/:correctionId", getCorrection);
router.lock("/:evaluationId", closeEvaluation);
router.put("/:evaluationId", updateEvaluation);
router.patch("/:evaluationId", updateEvaluationState);
router.patch("/:evaluationId/corrections/:correctionId/", updateCorrection);
router.delete("/:evaluationId", deleteEvaluation);

export default router;


