import express from "express";
import { generateImage, generateText,
  generateStreamText, } from "../controllers/llm.controller";
import { isUserAuthenticated } from "../middlewares/auth.middleware";
import { validateSchema } from "../middlewares/validate.middleware";
import { generateTextSchema,
  generateStreamSchema, generateImageSchema } from "../validations/llm.validation";

const router = express.Router();

// generate AI response using OpenRouter
router.post("/text/generate", validateSchema(generateTextSchema), generateText);

// generate stream response
router.get(
  "/text/stream-generate",
  validateSchema(generateStreamSchema),
  generateStreamText
);

// generate an image via OpenAI / other provider
router.post(
  "/image/generate",
  isUserAuthenticated,
  validateSchema(generateImageSchema),
  generateImage
);

export default router;
