import express from 'express';
const router = express.Router();
import { sessionCreate, /*sessionDelete,*/ updateUserPassword, sendEmailToUpdatePassword, sendEmailToResetPassword } from "../controllers/auth.controller.js";
import { getUserByEmail } from "../controllers/users.controller.js";

router.post("/signin", sessionCreate);
router.patch("/updatePassword", updateUserPassword);
router.post("/emailUpdatePassword", sendEmailToUpdatePassword);
router.post("/emailResetPassword", sendEmailToResetPassword);
router.post("/resetPassword", getUserByEmail);



/* router.get("/signout", sessionDelete) */

export default router;