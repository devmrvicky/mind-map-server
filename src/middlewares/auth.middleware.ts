import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../model/user.model";
import { env } from "../env/env";
import { errorHandler, ErrorResponse } from "../handlers/handleErrorResponse";
import { logger } from "../config/logger.config";

const isUserAuthenticated = async (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken =
      (req.cookies && req.cookies.accessToken) ||
      (req.header && req.header("accessToken")?.replace("Bearer ", ""));
    logger.log("accessToken:=> ", accessToken);
    if (!accessToken) {
      logger.error("Access token is missing in request");
      res
        .status(401)
        .json(
          errorHandler.authError("Access token is missing. Please log in.")
        );
      return;
    }
    let decodedData: null | jwt.JwtPayload | string;
    try {
      if (!env.JWT_SECRET) {
        logger.error("JWT_SECRET is not defined in environment variables.");
        res
          .status(401)
          .json(
            errorHandler.notFound(
              "JWT_SECRET is not defined in environment variables."
            )
          );
        return;
      }
      // decodedData = jwt.verify(accessToken, env.JWT_SECRET);
      decodedData = jwt.decode(accessToken);
    } catch (error) {
      logger.error("Invalid access token: " + error);
      res
        .status(401)
        .json(
          errorHandler.authError(
            error instanceof Error ? error.message : "Invalid access token."
          )
        );
      return;
    }
    if (
      typeof decodedData !== "object" ||
      !decodedData ||
      !("id" in decodedData)
    ) {
      logger.error("Invalid access token payload");
      res
        .status(401)
        .json(errorHandler.authError("Invalid access token payload"));
      return;
    }
    const user = await User.findById(decodedData.id);
    if (!user) {
      logger.error("user did not found in database");
      res.status(401).json(errorHandler.authError("user didn't found."));
      return;
    }
    req.user = user; // Assign the user to the extended Request object
    next();
  } catch (error) {
    logger.error("Error in authentication middleware: " + error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res
      .status(500)
      .json(
        errorHandler.serverError(
          error instanceof Error ? error.message : "An unknown error occurred"
        )
      );
  }
};

export { isUserAuthenticated };
