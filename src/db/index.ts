import mongoose from "mongoose";
import { env } from "../env/env";
import { exit } from "process";
import { logger } from "../config/logger.config";

async function connectDB() {
  try {
    console.log(env.MONGODB_URI);
    if (!env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }
    const connectionIntance = await mongoose.connect(
      `${env.MONGODB_URI}/llm-chat`
    );
    logger.info(`MongoDB connected: ${connectionIntance.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    exit(1);
  }
}

export default connectDB;
