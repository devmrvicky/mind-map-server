import express from "express";
import {
  getUser,
  //   signupUser,
  //   loginUserWithEmail,
  logoutUser,
  //   deleteUser,
  //   updateUser,
  //   updateOrResetPassword,
  //   checkAccessToken,
} from "../controllers/user.controller";
// import { isEmailVerify } from "../middlewares/email.middlewares.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware";
// import { getUser } from "../controllers/user.controller";

const router = express.Router();

router.get("/", isUserAuthenticated, getUser);
// // Define a POST route for user signup
// router.post("/signup", isEmailVerify, signupUser);
// // define a POST route for user login
// router.post("/loginWithEmail", loginUserWithEmail);
// // route for logout
router.post("/logout", isUserAuthenticated, logoutUser);
// // route for delete user
// router.delete("/deleteUser", isUserAuthenticated, deleteUser);
// // route for update user
// router.put("/updateUser", isUserAuthenticated, updateUser);
// // route for reset password
// router.put("/reset-password", isEmailVerify, updateOrResetPassword);
// // route for access token validation
// router.get("/checkValidation", checkAccessToken);

export default router;
