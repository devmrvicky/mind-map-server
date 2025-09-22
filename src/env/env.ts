import { z } from "zod/v4";

import { logger } from "../config/logger.config";

const EnvSchema = z.object({
  OPENROUTER_API_KEY: z.string(),
  OPENROUTER_BASE_URL: z.string().url(),
  NODE_ENV: z.enum(["DEVELOPMENT", "PRODUCTION", "TEST"]),
  NEBIUS_API_KEY: z.string(),
  NEBIUS_BASE_URL: z.string().default("https://api.studio.nebius.com/v1/"),
  MONGODB_URI: z.string(),
  MONGODB_URI_LOCAL: z.string().default("mongodb://localhost:27017"),
  MONGODB_DB_NAME: z.string().default("llm-chat"),
  // IS_PRODUCTION: z.boolean().default(false),
  GOOGLEAPI_CLIENT_ID: z.string(),
  GOOGLEAPI_CLIENT_SECRET: z.string(),
  GOOGLEAPI_REDIRECT_URI: z
    .string()
    .default("http://localhost:5173/api/auth/google/callback"),
  GOOGLEAPI_URL: z
    .string()
    .default("https://people.googleapis.com/v1/people/me"),

  // # JWT secret
  JWT_SECRET: z.string(),
  JWT_REFRESH_TOKEN_EXPIRY: z.string(),
  JWT_ACCESS_TOKEN_EXPIRY: z.string(),

  IMAGEKIT_URL_ENDPOINT: z.string().default("https://ik.imagekit.io/mindmapai"),
  IMAGEKIT_PUBLIC_KEY: z.string(),
  IMAGEKIT_PRIVATE_KEY: z.string(),

  PORT: z.string(),

  CLIENT_URL: z.string(),

  SYSTEM_MESSAGE: z.string().default("You are a helpful assistant."),
});

const createEnv = () => {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    logger.error("❌ Invalid environment variables:", parsed.error.format());
    throw new Error("Invalid environment variables");
  }
  return { ...parsed.data, PORT: Number(parsed.data.PORT) };
};

export const env = createEnv();

export type Env = z.infer<typeof EnvSchema>;
