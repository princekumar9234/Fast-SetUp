import express from "express";
import morgan from "morgan";
import authRouter from "./routes/user.router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import config from "./config/config.js";


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


export default app;
