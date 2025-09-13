import { getAuthUrl, Oauth2Client } from "../config/OAuth.config";
import axios from "axios";
// import { createdUserDocForSignupWithGoogle } from "./user.controller";
import generateTokens from "../utils/generateTokens";
import { createdUserDocForSignupWithGoogle } from "./user.controller";
import { Response, Request } from "express";
import {
  OAuthCallbackInput,
  OAuthRedirectInput,
} from "../validations/OAuth.validation";
import { errorHandler, ErrorResponse } from "../handlers/handleErrorResponse";
import {
  SuccessResponse,
  successHandler,
} from "../handlers/handleSuccessResponse";
import { env } from "../env/env";
import { GoogleRegisterInput } from "../validations/user.validation";
import { logger } from "../config/logger.config";

// const API_ENDPOINT = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';

// This function is used to redirect the user to the google auth url.
const redirectGoogleAuthUrl = async (
  req: Request<OAuthRedirectInput>,
  res: Response<SuccessResponse<{ url: string }> | ErrorResponse>
): Promise<void> => {
  const OAuth2Url = getAuthUrl([
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/profile.language.read",
    "https://www.googleapis.com/auth/user.birthday.read",
    "https://www.googleapis.com/auth/user.emails.read",
    "https://www.googleapis.com/auth/user.gender.read",
    "https://www.googleapis.com/auth/user.phonenumbers.read",
  ]);
  res.status(200).json(successHandler.create("OK", { url: OAuth2Url }));
};

// This function is used to get the user details from google and create a new user or login the user
const getUserDetailsAndCreateUserOrLogin = async (
  req: Request,
  res: Response<SuccessResponse<any> | ErrorResponse>
): Promise<void> => {
  try {
    const validate = (req as any).validated as OAuthCallbackInput;
    const { code } = validate.body;
    // console.log({ googleAuthCode: code });
    if (!code) {
      logger.error("Google Auth code is missing in request body");
      res.status(400).json(errorHandler.missingField("Google auth code"));
      return;
    }
    const { tokens } = await Oauth2Client.getToken(code);
    // console.log("google auth tokens: ", tokens);
    Oauth2Client.setCredentials(tokens);
    const access_token = tokens.access_token;
    // console.log("access_token: ", tokens.access_token);
    if (!env.GOOGLEAPI_URL) {
      logger.error("GOOGLEAPI_URL is not defined in environment variables");
      res.status(400).json(errorHandler.missingField("GOOGLEAPI_URL"));
      return;
    }
    // console.log("google api url: ", process.env.GOOGLEAPI_URL);
    const response = await axios.get(env.GOOGLEAPI_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        personFields: "names,emailAddresses,genders,photos,birthdays",
      },
    });
    // console.log("response from google api url: ", response);
    const userData = response.data;

    if (!userData) {
      logger.error("User data not found from google");
      res.status(404).json(errorHandler.notFound("user data from google"));
      return;
    }
    const { year, month, day } = userData.birthdays[0]?.date;
    const userDetails: GoogleRegisterInput = {
      name: userData.names[0]?.displayName || null,
      email: userData.emailAddresses[0]?.value || null,
      profilePic: userData.photos[0]?.url || null,
      dob: `${day}/${month}/${year}` || null,
      authType: "google",
      password: "undefined",
    };
    // signup user or create new user with these data
    // login user with these data
    // this function will create a new user if the user with the same email and authType="email" does not exist or login the user if the user with the same email and authType="google" exists
    // console.log("user datails:=> ", userDetails);
    const user = await createdUserDocForSignupWithGoogle(userDetails);
    // console.log("user from database:=> ", user);
    if (!user) {
      logger.error("User not found or created");
      res.status(500).json(errorHandler.serverError("user not found"));
      return;
    }
    const { accessToken } = await generateTokens(user);
    // console.log({ status: true, message: "User logged in successfully", user });
    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "PRODUCTION",
        sameSite: env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
      })
      .json(
        successHandler.create("User logged in successfully", {
          user,
          accessToken,
        })
      );
  } catch (error) {
    logger.error("error while fatching user detail " + error);
    res
      .status(500)
      .json(
        errorHandler.serverError(
          error instanceof Error ? error.message : "Unknown error"
        )
      );
  }
};

export { getUserDetailsAndCreateUserOrLogin, redirectGoogleAuthUrl };
