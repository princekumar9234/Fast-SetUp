import mongoose from "mongoose";
import config from "./config.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export default async function ConnectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("DataBase connect Successfully");
  } 
  catch (error) {
    console.log(error);
  }
}
