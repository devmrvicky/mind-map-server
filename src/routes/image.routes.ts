import express from "express";
import { generateImage } from "../controllers/llm.controller";
import { isUserAuthenticated } from "../middlewares/auth.middleware";
import { validateSchema } from "../middlewares/validate.middleware";
import { generateImageSchema } from "../validations/llm.validation";

const router = express.Router();

// generate an image via OpenAI / other provider
router.post(
  "/generate",
  isUserAuthenticated,
  validateSchema(generateImageSchema),
  generateImage
);

export default router;
