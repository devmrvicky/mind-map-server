import { getAuthUrl, Oauth2Client } from "../config/OAuth.config";
import axios from "axios";
// import { createdUserDocForSignupWithGoogle } from "./user.controller";
import generateTokens from "../utils/generateTokens";
import { createdUserDocForSignupWithGoogle } from "./user.controller";
import { Response, Request } from "express";

// const API_ENDPOINT = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';

// This function is used to redirect the user to the google auth url.
const redirectGoogleAuthUrl = async (req: Request, res: Response) => {
  const OAuth2Url = getAuthUrl([
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/profile.language.read",
    "https://www.googleapis.com/auth/user.birthday.read",
    "https://www.googleapis.com/auth/user.emails.read",
    "https://www.googleapis.com/auth/user.gender.read",
    "https://www.googleapis.com/auth/user.phonenumbers.read",
  ]);
  res.status(200).json({
    status: true,
    message: "Redirected OAuthUrl successfully",
    OAuth2Url,
  });
};

// This function is used to get the user details from google and create a new user or login the user
const getUserDetailsAndCreateUserOrLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const { code }: { code: string } = req.body;
    // console.log({ googleAuthCode: code });
    if (!code) {
      res.status(400).json({
        status: false,
        error: "Bad Request",
        message: "Google auth code is required",
      });
      return;
    }
    const { tokens } = await Oauth2Client.getToken(code);
    // console.log("google auth tokens: ", tokens);
    Oauth2Client.setCredentials(tokens);
    const access_token = tokens.access_token;
    // console.log("access_token: ", tokens.access_token);
    if (!process.env.GOOGLEAPI_URL) {
      res.status(404).json({
        status: false,
        message: "GOOGLEAPI_URL is not defined in the environment variables",
      });
      return;
    }
    // console.log("google api url: ", process.env.GOOGLEAPI_URL);
    const response = await axios.get(process.env.GOOGLEAPI_URL, {
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
      // console.log("user data did not get.");
      res
        .status(4040)
        .json({ status: false, message: "user data did not get." });
      return;
    }
    const { year, month, day } = userData.birthdays[0]?.date;
    const userDetails: Partial<IUser> = {
      name: userData.names[0]?.displayName || null,
      email: userData.emailAddresses[0]?.value || null,
      profilePic: userData.photos[0]?.url || null,
      dob: `${day}/${month}/${year}` || "", // { year, month, day }
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
      res.status(500).json({
        status: false,
        error: "server error",
        message: "Did not create user?",
      });
      return;
    }
    const { accessToken } = await generateTokens(user);
    // console.log({ status: true, message: "User logged in successfully", user });
    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
      })
      .json({ status: true, message: "User logged in successfully", user });
  } catch (error) {
    console.error("error while fatching user detail " + error);
    res.status(500).json({
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export { getUserDetailsAndCreateUserOrLogin, redirectGoogleAuthUrl };
