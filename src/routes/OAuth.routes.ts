import express from "express";
import {
  getUserDetailsAndCreateUserOrLogin,
  redirectGoogleAuthUrl,
} from "../controllers/OAuth.controller";
import { validateSchema } from "../middlewares/validate.middleware";
import {
  oauthRedirectSchema,
  oauthCallbackSchema,
} from "../validations/OAuth.validation";

const router = express.Router();

router.get(
  "/google/redirect",
  validateSchema(oauthRedirectSchema),
  redirectGoogleAuthUrl
);
router.post(
  "/google/callback",
  validateSchema(oauthCallbackSchema),
  getUserDetailsAndCreateUserOrLogin
);

export default router;
