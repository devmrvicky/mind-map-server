import express from "express";
import { getUser, logoutUser } from "../controllers/user.controller";
import { isUserAuthenticated } from "../middlewares/auth.middleware";
import { validateSchema } from "../middlewares/validate.middleware";
import {
  getUserSchema,
  logoutUserSchema,
} from "../validations/user.validation";

const router = express.Router();

router.get("/", isUserAuthenticated, validateSchema(getUserSchema), getUser);
// // route for logout
router.post(
  "/logout",
  isUserAuthenticated,
  validateSchema(logoutUserSchema),
  logoutUser
);

export default router;
