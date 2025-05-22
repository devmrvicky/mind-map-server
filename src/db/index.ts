import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

async function connectDB() {
  try {
    console.log(process.env.MONGODB_URI);
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }
    // const connectionIntance = await mongoose.connect(
    //   `mongodb+srv://devmrvicky:nF1qvzQtjdXAD7GN@llm-chat-cluster0.zia4i0u.mongodb.net/llm-chat` as string
    // );
    const connectionIntance = await mongoose.connect(
      `${process.env.MONGODB_URI}/llm-chat`
    );
    console.log(`MongoDB connected: ${connectionIntance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export default connectDB;
