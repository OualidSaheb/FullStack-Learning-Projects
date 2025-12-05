import express from 'express';
const router = express.Router();
import { fetchUserFromToken } from "../middlewares/auth.middleware.js";
//import { uploadImage, addAvatar } from "../middlewares/multer.middleware";

import usersRouter from "./users.routes.js";
import authRouter from "./auth.routes.js";
import gridsRouter from "./grids.routes.js";
import groupsRouter from "./groups.routes.js";
import sessionRouter from "./sessions.routes.js";
import coursesRouter from "./courses.routes.js";
import classroomsRouter from "./classrooms.routes.js";
//import errorRouter from "./error.routes.js";
import evaluationsRouter from "./evaluations.routes.js";
import departmentsRouter from "./departments.routes.js";
import organisationsRouter from "./organisations.routes.js";
import { getData } from "../database/getData.js";

router.get("/version", (req, res) => {
  res.send("API version 1.0.0");
});

// SECURITY: force all routes to require login except / and /auth.
router.use(/^(?!\/$|\/auth)/, fetchUserFromToken);

router.use("/users", usersRouter);
router.use("/auth", authRouter);
router.use("/grids", gridsRouter);
router.use("/groups", groupsRouter);
router.use("/sessions", sessionRouter);
router.use("/courses", coursesRouter);
router.use("/classrooms", classroomsRouter);
router.use("/evaluations", evaluationsRouter);
router.use("/departments", departmentsRouter);
router.use("/organisations", organisationsRouter);
router.use("/getdata", getData);
/* router.use("/error", errorRouter); */

export default router;
