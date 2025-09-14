import { z } from "zod";

export const generateTextSchema = z.object({
  body: z.object({
    prompt: z.string().min(1),
    usedModel: z.string().min(1).optional(),
    fileUrls: z.string().optional(), // JSON string or omit
  }),
});

export const generateStreamSchema = z.object({
  query: z.object({
    prompt: z.string().min(1),
  }),
  body: z.object({
    usedModel: z.string().min(1),
    fileUrls: z.string().optional(),
  }),
});

export const generateImageSchema = z.object({
  body: z.object({
    prompt: z.string().min(1),
    model: z.string().min(1).optional(),
  }),
});

export type GenerateTextInput = z.infer<typeof generateTextSchema>;
export type GenerateStreamInput = z.infer<typeof generateStreamSchema>;
export type GenerateImageInput = z.infer<typeof generateImageSchema>;
