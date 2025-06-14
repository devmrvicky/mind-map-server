import { User } from "../model/user.model";
// import generateTokens from "../utils/generateTokens.ts";
// import jwt from "jsonwebtoken";
import { IUser } from "../types/globle.d";
import { Request, Response } from "express";

// get user
const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(400).json({ status: false, message: "User not found." });
      return;
    }
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      res.status(404).json({ status: false, message: "User does not exist." });
      return;
    }
    res.status(200).json({ status: true, user });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ status: false, message: errorMessage });
  }
};

// signup user
// const signupUser = async (req, res) => {
//   const { email, password, confirmPassword } = req.body;
//   // check validation and empty fields
//   if (!email || !password || !confirmPassword) {
//     return res.status(400).json({
//       status: false,
//       error: "empty fields",
//       message: "All fields are required",
//     });
//   }
//   // check if email is verified
//   const isEmailVerified = req.email === email;
//   if (!isEmailVerified) {
//     return res.status(400).json({
//       status: false,
//       error: "email not verified",
//       message: "Email is not verified",
//     });
//   }
//   // check if password and confirmPassword match
//   if (password !== confirmPassword) {
//     return res.status(400).json({
//       status: false,
//       error: "password mismatch",
//       message: "Passwords do not match",
//     });
//   }
//   // full name from email
//   const fullName = email.split("@")[0];
//   // create new user
//   const newUser = new User({ fullName, email, password, authType: "email" });
//   try {
//     await newUser.save();

//     // generate tokens
//     const { refreshToken, accessToken } = await generateTokens(newUser);

//     const options = {
//       httpOnly: true,
//       secure: true,
//     };

//     return res
//       .clearCookie("email_verification_token")
//       .cookie("refreshToken", refreshToken, options)
//       .cookie("accessToken", accessToken, options)
//       .status(201)
//       .json({
//         status: true,
//         message: "User created successfully",
//         user: newUser,
//       });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ status: false, error: "server error", message: error.message });
//   }
// };

// signup and login user with google
const createdUserDocForSignupWithGoogle = async (
  userDetails: Partial<IUser>
) => {
  // console.log(
  //   "user details from createdUserDocForSignupWithGoogle:=> ",
  //   userDetails
  // );
  // get email from userDetails
  // check if user already exists
  // if user already exists with this email then login user
  // else create new user
  // generate tokens
  // return user

  const { email } = userDetails;
  // console.log("email:=> ", email);
  if (!email) {
    return null;
  }
  let userWithEmail = await User.findOne({ email, authType: "email" });
  // console.log("userWithEmail:=> ", userWithEmail);
  if (userWithEmail) {
    throw new Error(
      "User already exists with this email. Please login with email."
    );
  }
  const user = await User.findOne({ email, authType: "google" });
  // console.log("user:=> ", user);
  // const {refreshToken} = await generateTokens(user);
  if (!user) {
    const newUser = new User({ ...userDetails });
    await newUser.save();
    return newUser;
  }
  return user;
  // after return user for signup or login please visit getUserDetailsAndCreateUserOrLogin function from OAuth.controller.js file
};

// // login user with email
// const loginUserWithEmail = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // check validation and empty fields
//     if (!email || !password) {
//       return res.status(400).json({
//         status: false,
//         error: "empty fields",
//         message: "All fields are required",
//       });
//     }
//     // check if user exists
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         status: false,
//         error: "user not found",
//         message: "User not found",
//       });
//     }
//     if (user.authType === "google") {
//       return res.status(400).json({
//         status: false,
//         error: "google user",
//         message:
//           "User already exists with this email. Please login with Google.",
//       });
//     }
//     // check if password is correct
//     const isPasswordCorrect = await user.isPasswordCorrect(password);
//     console.log({ isPasswordCorrect });
//     if (!isPasswordCorrect) {
//       return res.status(401).json({
//         status: false,
//         error: "incorrect password",
//         message: "Incorrect password",
//       });
//     }
//     // generate tokens
//     const { refreshToken, accessToken } = await generateTokens(user);
//     // console.log(accessToken)
//     // get user without password and refresh token
//     user = await User.findOne({ email }).select("-password -refreshToken");
//     const options = {
//       httpOnly: true,
//       secure: true,
//     };
//     res
//       .status(200)
//       .cookie("refreshToken", refreshToken, options)
//       .cookie("accessToken", accessToken, options)
//       .json({ status: true, message: "Login successful", user });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ status: false, error: "server error", message: error.message });
//   }
// };

// logout user (email and google user)
const logoutUser = async (req: Request, res: Response) => {
  console.log("you hit successfully /logoutUser endpoint");
  try {
    if (!req.user) {
      res.status(400).json({ status: false, message: "User did not find." });
      return;
    }
    await User.findByIdAndUpdate(req.user._id, {
      accessToken: undefined,
    });
    res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({ status: true, message: "user logout successfully." });
  } catch (error) {
    console.error("error while user logout ", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ status: false, message: errorMessage });
  }
};

// // delete user (email and google user)
// const deleteUser = async (req, res) => {
//   try {
//     const user = req.user;
//     const deleteRes = await User.findByIdAndDelete(user.id);
//     console.log(deleteRes);
//     // delete all data related to this user
//     res
//       .status(200)
//       .clearCookie("accessToken")
//       .clearCookie("refreshToken")
//       .json({ status: true, message: "user delet successfully" });
//   } catch (error) {
//     console.error("error while deleting user, ", error);
//     res.status(500).json({ status: false, message: error.message });
//   }
// };

// // update user
// const updateUser = async (req, res) => {
//   try {
//     const { fullName, gender, dob } = req.body;
//     if (!fullName) {
//       return res.status(400).json({
//         status: false,
//         error: "empty field",
//         message: "full name must be filled.",
//       });
//     }
//     // for getting profilePic url string. we have to user multer for upload image on server and cloudinary for upload image on cloud
//     // get local path from req.file
//     const profilePicLocalPath = req.files?.profilePic[0]?.path;
//     let profilePicUrl;
//     if (profilePicLocalPath) {
//       // profilePicUrl will get from any cloud storage like cloudinary or google firebase
//     }
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { fullName, gender, dob },
//       { validateBeforeSave: false }
//     );
//     res
//       .status(200)
//       .json({ status: true, message: "user update successfully", user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: false, message: error.message });
//   }
// };

// // update or reset password
// const updateOrResetPassword = async (req, res) => {
//   try {
//     const { email, password, confirmPassword } = req.body;
//     console.log({ email, password, confirmPassword });
//     // check if password and confirmPassword field is filled
//     if (!password || !confirmPassword) {
//       return res.status(400).json({
//         status: false,
//         error: "password or confirm password must be filled",
//       });
//     }
//     // check if password and confirmPassword is matching
//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         status: false,
//         error: "Password and confirm password must be same",
//       });
//     }
//     // check if email is verified
//     const isEmailVerified = req.email === email;
//     if (!isEmailVerified) {
//       return res.status(400).json({
//         status: false,
//         error: "email not verified",
//         message: "Email is not verified",
//       });
//     }
//     // ? we have to test here that password is being hash or not before update password field
//     // ? we have to check also that "validateBeforeSave: false" is working here or not
//     await User.findOneAndUpdate(
//       { email },
//       { password },
//       { validateBeforeSave: false }
//     );
//     res
//       .status(200)
//       .clearCookie("email_verification_token")
//       .json({ status: false, message: "Password change successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: false, message: error.message });
//   }
// };

// // check if user's access token has expired
// const checkAccessToken = async (req, res) => {
//   try {
//     const { accessToken } = req.cookies;
//     if (!accessToken) {
//       return res.status(401).json({
//         status: false,
//         error: "no access token",
//         message: "Access token is required",
//       });
//     }
//     // verify access token
//     const user = jwt.verify(accessToken, process.env.JWT_SECRET);
//     if (!user) {
//       return res.status(401).json({
//         status: false,
//         error: "invalid token",
//         message: "Access token is invalid or expired",
//       });
//     }
//     res.status(200).json({
//       status: true,
//       message: "Access token is valid",
//       user,
//     });
//   } catch (error) {
//     console.error("Error while checking access token: ", error);
//     res.status(500).json({ status: false, message: error.message });
//   }
// };

export {
  getUser,
  // signupUser,
  // loginUserWithEmail,
  logoutUser,
  // deleteUser,
  // updateUser,
  // updateOrResetPassword,
  // checkAccessToken,
  createdUserDocForSignupWithGoogle,
};
