import { z } from "zod";

/**
 * ImageKit API validations
 */

// no params/body required for auth endpoint, but keep a schema for typing consistency
export const imagekitAuthenticationSchema = z.object({
  // you may include query or body fields in future
  body: z.object({}).optional(),
});

export const deleteFileSchema = z.object({
  body: z.object({
    fileId: z.string().min(1, "fileId is required"),
  }),
});

export const deleteFilesSchema = z.object({
  body: z.object({
    // controller expects a JSON string of ids; keep as string for now
    fileIds: z.string().min(1, "fileIds is required"),
  }),
});

// exported types (follow project pattern)
export type ImagekitAuthInput = z.infer<typeof imagekitAuthenticationSchema>;
export type DeleteFileInput = z.infer<typeof deleteFileSchema>;
export type DeleteFilesInput = z.infer<typeof deleteFilesSchema>;
