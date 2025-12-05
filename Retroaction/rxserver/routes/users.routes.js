import express from 'express';
const router = express.Router();
import {
  /*signup,*/
  getCurrentUser,
  getAllUser,
  createUsersFromCSV,
  createUserTeacher,
  /*updateAvatar,*/
  /*updateUserPassword,*/
  setCurrentDepartment,
  getTeachers,
  getStudents,
  getCoordinators,
  getUserById,
  /*getUserByEmail,*/
  updateTeacher,
  deleteUser,
} from "../controllers/users.controller.js";

import { Permission, hasPermission } from "../middlewares/auth.middleware.js";

import multer from "multer";
import { storage } from "../cloudinary/index.js";
const upload = multer({ storage: storage });

// all users
// router.post("/", signup);

// all auth users
router.get("/", getCurrentUser);
router.get("/user/:id", getUserById);
// router.patch("/updatePassword", updateUserPassword);

// all auth users except Student
router.use(hasPermission([Permission.admin, Permission.coordinator, Permission.teacher]));
router.get("/students", getStudents);
router.put("/addStudents", createUsersFromCSV);

// Admin and Coordinator
router.use(hasPermission([Permission.admin, Permission.coordinator]));
router.get("/teachers", getTeachers);
router.put("/update/teacher/:id", updateTeacher);
router.post("/addTeacher", createUserTeacher);
router.patch("/department", setCurrentDepartment);

// Admin
router.use(hasPermission([Permission.admin]));
router.get("/users", getAllUser);
router.get("/coordinators", getCoordinators);
router.delete("/delete/:id", deleteUser);

export default router;

// router.post(
//   "/avatar",
//   upload.single("image"),
//   updateAvatar
// );
