import OpenAI from "openai";
import { env } from "../env/env";

// oepnai configure for generate image
export const nebiusClient = new OpenAI({
  baseURL: env.NEBIUS_BASE_URL,
  apiKey: env.NEBIUS_API_KEY,
});
