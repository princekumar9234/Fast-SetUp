import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";
import { validateUser } from "../middlewares/validator.middleware.js";
const authRouter = Router();

/**
 * POST /api/auth/register
 */
authRouter.post("/register",authLimiter,validateUser, userController.userRegister);

/**
 * POST/api/auth/login
 */
authRouter.post("/login",authLimiter, validateUser,userController.Login);
/**
 * GET /api/auth/refreshToken
 */
authRouter.get("/refreshtoken", userController.refreshToken);

/**
 * GET/api/auth/logout
 */
authRouter.get("/logout",authLimiter,validateUser, userController.logout);

/**
 * GET/api/auth/logOUtAll
 */
authRouter.get("/logoutall", userController.logoutall);

/**
 * GET /api/auth/verify-email
 */
authRouter.post("/emailVerify",authLimiter,validateUser, userController.verifyEmail);

/**
 * POST /api/auth/forgetEmail
 */
authRouter.post("/forgetEmail",authLimiter, userController.forgetPass);

/**
 * POST /api/auth/updatePassword
 */
authRouter.post("/updatePassword",validateUser, userController.updatePass);

/**
 * GET/user/get-me
 * @description : - get the current logged in user details
 */
authRouter.get("/get-me",  userController.userGetMe);



export default authRouter;
