import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variable");
}

if (!process.env.PORT) {
  throw new Error("PORT is not defined in environment variable");
}

if (!process.env.JWT_SECRECT) {
  throw new Error("JWT_SECRECT is not defined in environment variable");
}

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not defined in environment variable");
}

const config = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
  JWT_SECRECT: process.env.JWT_SECRECT,
  FRONTEND_URL: process.env.FRONTEND_URL?.trim().replace(/\/$/, ""),
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL || "sadipur92@gmail.com",
};

export default config;
