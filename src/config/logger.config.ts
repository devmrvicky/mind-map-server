import winston from "winston";
import path from "path";

// Define log file paths
const logDir = "logs";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }), // include stack trace
    winston.format.json()
  ),
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),

    // All logs
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

// Add console logging only in development
if (process.env.NODE_ENV !== "PRODUCTION") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}
