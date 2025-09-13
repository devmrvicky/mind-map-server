import { Request, Response, NextFunction } from "express";
import { errorHandler, ErrorResponse } from "../handlers/handleErrorResponse";
import { logger } from "../config/logger.config";

export const routeNotFound = (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  logger.error(`Route not found: ${req.originalUrl}`);
  res.status(404).json(errorHandler.notFound("Route not found"));
};

export const serverErrorHandler = (
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  logger.error("server error middleware: ", err.stack);
  res
    .status(500)
    .json(errorHandler.serverError(err.message || "Server Error", err));
};
