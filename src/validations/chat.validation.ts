import { z } from "zod";

// Create Chat
export const createChatSchema = z.object({
  params: z.object({
    chatRoomId: z.string(),
  }),
  body: z.object({
    prompt: z.string().min(1),
    usedModel: z.string().min(1),
    chatId: z.string(),
    role: z.enum(["user", "assistant"]),
    fileUrls: z.string().optional(), // assuming fileUrls is sent as a JSON string
  }),
});

// Get Chats in a Room
export const getChatsSchema = z.object({
  params: z.object({
    chatRoomId: z.string(),
  }),
});

// Delete All Chats in a Room
export const deleteAllChatsInRoomSchema = z.object({
  params: z.object({
    chatRoomId: z.string(),
  }),
});

// Types
export type CreateChatInput = z.infer<typeof createChatSchema>;
export type GetChatsInput = z.infer<typeof getChatsSchema>["params"];
export type DeleteAllChatsInRoomInput = z.infer<
  typeof deleteAllChatsInRoomSchema
>["params"];
