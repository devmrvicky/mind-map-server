import { z } from "zod";

export const googleRegisterSchema = z.object({
  name: z.string().min(1).optional().nullable(),
  email: z.string().email().optional().nullable(),
  profilePic: z.string().url().optional().nullable(),
  dob: z.string().optional().nullable(),
  authType: z.enum(["google", "email", "github"]),
  password: z.literal("undefined"),
});

export const emailRegisterSchema = z.object({
  body: z.object({
    email: z.string().email(),
    fullName: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

// mongodb _id
export const getUserSchema = z.object({
  user: z.object({
    _id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: "_id must be a valid MongoDB ObjectId",
    }),
  }),
});

// logout user
export const logoutUserSchema = getUserSchema;

export type GoogleRegisterInput = z.infer<typeof googleRegisterSchema>;
export type EmailRegisterInput = z.infer<typeof emailRegisterSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type GetUserInput = z.infer<typeof getUserSchema>;
export type LogoutUserInput = GetUserInput;
