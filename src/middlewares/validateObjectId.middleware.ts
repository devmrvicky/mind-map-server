import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { errorHandler, ErrorResponse } from "../handlers/handleErrorResponse";
import { logger } from "../config/logger.config";

const validateObjectId = (param: string) => {
  return (req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
    logger.info("valid object id middleware called");
    const id = req.params[param];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error(`Invalid ${param}: ${id}`);
      res.status(400).json(errorHandler.badRequest(`Invalid ${param}`));
      return;
    }
    next();
  };
};

export default validateObjectId;
