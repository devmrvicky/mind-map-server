import { Request, Response } from "express";
import { User } from "../model/user.model";
import { IUser } from "../types/globle.d";
import { errorHandler, ErrorResponse } from "../handlers/handleErrorResponse";
import {
  SuccessResponse,
  successHandler,
} from "../handlers/handleSuccessResponse";
import {
  GetUserInput,
  GoogleRegisterInput,
  LogoutUserInput,
} from "../validations/user.validation";
import { logger } from "../config/logger.config";

/**
 * Get authenticated user
 */
export const getUser = async (
  req: Request,
  res: Response<SuccessResponse<IUser> | ErrorResponse>
): Promise<void> => {
  try {
    const validate = (req as any).validated as GetUserInput;
    const userId = validate.user._id;
    if (!userId) {
      logger.error("user id not found in request.user");
      res
        .status(404)
        .json(errorHandler.notFound("User not found.") as ErrorResponse);
      return;
    }

    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      logger.error("user did not found in database");
      res
        .status(404)
        .json(errorHandler.notFound("User does not exist.") as ErrorResponse);
      return;
    }

    res
      .status(200)
      .json(successHandler.create("User fetched successfully", user));
  } catch (error) {
    logger.error("Error in getUser:", error);
    res
      .status(500)
      .json(
        errorHandler.serverError(
          error instanceof Error ? error.message : "An unknown error occurred",
          error
        ) as ErrorResponse
      );
  }
};

/**
 * Create or return user document for Google signup/login.
 * Returns created/found user or null.
 */
export const createdUserDocForSignupWithGoogle = async (
  userDetails: GoogleRegisterInput
): Promise<IUser | null> => {
  const { email } = userDetails;
  if (!email) return null;

  const userWithEmail = await User.findOne({ email, authType: "email" });
  if (userWithEmail) {
    throw new Error(
      "User already exists with this email. Please login with email."
    );
  }

  const user = await User.findOne({ email, authType: "google" });
  if (!user) {
    const newUser = new User({ ...userDetails });
    await newUser.save();
    return newUser;
  }

  return user;
};

/**
 * Logout user (clear cookies and unset token on user doc)
 */
export const logoutUser = async (
  req: Request,
  res: Response<SuccessResponse<null> | ErrorResponse>
): Promise<void> => {
  try {
    const validate = (req as any).validated as LogoutUserInput;
    if (!validate.user) {
      logger.error("User not found in request.");
      res
        .status(404)
        .json(errorHandler.notFound("User did not found.") as ErrorResponse);
      return;
    }

    await User.findByIdAndUpdate(validate.user._id, {
      accessToken: undefined,
    });

    res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(successHandler.create("User logged out successfully"));
  } catch (error) {
    logger.error("error while user logout ", error);
    res
      .status(500)
      .json(
        errorHandler.serverError(
          error instanceof Error ? error.message : "An unknown error occurred",
          error
        ) as ErrorResponse
      );
  }
};
