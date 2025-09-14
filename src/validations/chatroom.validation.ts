import { z } from "zod";
import { objectIdSchema } from "./objectIdSchema"

export const createChatRoomSchema = z.object({
  body: z.object({
    chatRoomName: z.string(),
    // client generates UUID for chatRoomId (optional on create)
    chatRoomId: z.string(),
  }),
  user: z.object({
    _id: objectIdSchema,
  }),
});

export const getChatRoomSchema = z.object({
  user: z.object({
    _id: objectIdSchema,
  }),
});

export const deleteChatRoomSchema = z.object({
  params: z.object({
    chatRoomId: z.string(),
  }),
});

export type CreateChatRoomInput = z.infer<typeof createChatRoomSchema>;
export type GetChatRoomInput = z.infer<typeof getChatRoomSchema>;
export type DeleteChatRoomInput = z.infer<
  typeof deleteChatRoomSchema
>;
