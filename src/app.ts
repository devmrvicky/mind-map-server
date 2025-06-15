import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
// import bodyParser from "body-parser";

dotenv.config({
  path: "../.env",
});

const app = express();

// app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "PRODUCTION"
        ? "https://mind-map-five-vert.vercel.app"
        : "http://localhost:5173", // Replace with your client URL
    credentials: true, // Allow cookies to be sent
  })
);

app.get("/test", (req, res) => {
  res.send("Test route is working!");
});

// Import your routes here
// chats routes
import chatRoutes from "./routes/chat.routes";
app.use("/api/chat", chatRoutes);

// auth routes
import authRoutes from "./routes/OAuth.routes";
app.use("/api/auth", authRoutes);

import userRoutes from "./routes/user.routes";
app.use("/api/user", userRoutes);


export default app;
