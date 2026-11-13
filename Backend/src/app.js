import express from "express";
import morgan from "morgan";
import authRouter from "./routes/user.router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import config from "./config/config.js";
import rateLimit from "express-rate-limit";

const app = express();

app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/user", authRouter);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests. Please try again later.', data: null },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts. Please wait 15 minutes.', data: null },
  standardHeaders: true,
  legacyHeaders: false,
});


export default app;
