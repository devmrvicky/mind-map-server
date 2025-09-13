import { z } from "zod";

/**
 * OAuth
 */
export const oauthCallbackSchema = z.object({
  body: z.object({
    code: z.string().min(1),
    state: z.string().optional(),
  }),
});

export const oauthRedirectSchema = z.object({
  // no body required for redirect endpoint; kept for consistency
  body: z.object({}).optional(),
});

export type OAuthCallbackInput = z.infer<typeof oauthCallbackSchema>;
export type OAuthRedirectInput = z.infer<typeof oauthRedirectSchema>;
