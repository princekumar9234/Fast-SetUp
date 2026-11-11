import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
const authRouter = Router();

/**
 * POST /api/auth/register
 */
authRouter.post("/register", userController.userRegister);

/**
 * POST/api/auth/login
 */
authRouter.post("/login", userController.Login);
/**
 * GET /api/auth/refreshToken
 */
authRouter.get("/refreshtoken", userController.refreshToken);

/**
 * GET/api/auth/logout
 */
authRouter.get("/logout", userController.logout);

/**
 * GET/api/auth/logOUtAll
 */
authRouter.get("/logoutall", userController.logoutall);

/**
 * GET /api/auth/verify-email
 */
authRouter.get("/verifyEmail", userController.verifyEmail);

/**
 * POST /api/auth/forgetEmail
 */
authRouter.post("/forgetEmail", userController.forgetPass);

/**
 * POST /api/auth/updatePassword
 */
authRouter.post("/updatePassword", userController.updatePass);

/**
 * GET/user/get-me
 * @description : - get the current logged in user details
 */
authRouter.get("/get-me",  userController.userGetMe);



export default authRouter;
