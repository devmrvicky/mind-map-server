import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import dotenv from "dotenv";

dotenv.config();

import { env } from "./env/env";

// routes
import chatRoutes from "./routes/chat.routes";
import authRoutes from "./routes/OAuth.routes";
import userRoutes from "./routes/user.routes";
import imagekitRoutes from "./routes/imagekit.routes";
import {
  serverErrorHandler,
  routeNotFound,
} from "./middlewares/error.middleware";

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(hpp());

// Other Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(morgan("combined"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Test Route
app.get("/test", (req, res) => {
  res.send("Test route is working!");
});

// routes
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/imagekit", imagekitRoutes);

// Error handling
app.use(routeNotFound);
app.use(serverErrorHandler);

export default app;
