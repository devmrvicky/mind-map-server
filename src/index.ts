import app from "./app";
import { logger } from "./config/logger.config";
import connectDB from "./db/index";
import { env } from "./env/env";

connectDB()
  .then(() => {
    const PORT = env.PORT || 3000;

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Error connecting to the database:", error);
  });

// Handle crashes gracefully
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});
