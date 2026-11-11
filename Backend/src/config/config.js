import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in envoriment variable");
}

if (!process.env.PORT) {
  throw new Error("PORT is not defined in envoriment variable");
}

if (!process.env.JWT_SECRECT) {
  throw new Error("JWT_SECRECT is not defined in envoriment variable");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Google_Client_Id in not defined in envoriment variable");
}

if (!process.env.GOOGLE_CLIENT_SECRECT) {
  throw new Error(
    "Google_client_secrect is not defined in envoirment variable",
  );
}

if (!process.env.GOOGLE_REFRESH_TOKEN) {
  throw new Error("Google_refresh_token is not defined in Envoirment variable");
}

if (!process.env.GOOGLE_USER) {
  throw new Error("Google_User is not defined in envoirment variable");
}
if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not defined in envoirment variable");
}

const config = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
  JWT_SECRECT: process.env.JWT_SECRECT,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRECT: process.env.GOOGLE_CLIENT_SECRECT,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_USER: process.env.GOOGLE_USER,
  FRONTEND_URL: process.env.FRONTEND_URL
};

export default config;
