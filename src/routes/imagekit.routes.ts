import express from "express";
import { imagekitAuthentication } from "../controllers/imagekit.controller";
import { imagekitAuthenticationSchema } from "../validations/imagekit.validation";
import { validateSchema } from "../middlewares/validate.middleware";

const router = express.Router();

router.get(
  "/auth",
  validateSchema(imagekitAuthenticationSchema),
  imagekitAuthentication
);

export default router;
