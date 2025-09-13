import { z } from "zod";

export const createChatRoomSchema = z.object({
  body: z.object({
    chatRoomName: z.string(),
    // client generates UUID for chatRoomId (optional on create)
    chatRoomId: z.string().uuid().optional(),
  }),
  user: z.object({
    _id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: "_id must be a valid MongoDB ObjectId",
    }),
  }),
});

export const getChatRoomSchema = z.object({
  user: z.object({
    _id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: "_id must be a valid MongoDB ObjectId",
    }),
  }),
});

export const deleteChatRoomSchema = z.object({
  params: z.object({
    chatRoomId: z.string().uuid(),
  }),
});

export type CreateChatRoomInput = z.infer<typeof createChatRoomSchema>;
export type GetChatRoomInput = z.infer<typeof getChatRoomSchema>["user"];
export type DeleteChatRoomInput = z.infer<
  typeof deleteChatRoomSchema
>["params"];
