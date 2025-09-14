import express from "express";
import {
  createChat,
  getChats,
  deleteAllChatsInRoom,
} from "../controllers/chat.controller";
import { isUserAuthenticated } from "../middlewares/auth.middleware";
import {
  createChatSchema,
  getChatsSchema,
  deleteAllChatsInRoomSchema,
} from "../validations/chat.validation";
import { validateSchema } from "../middlewares/validate.middleware";

const router = express.Router();

// create a new chat (user or assistant) in a room
router.post(
  "/create/:chatRoomId",
  validateSchema(createChatSchema),
  createChat
);

// get all chats for a specific chat room
router.get("/:chatRoomId", validateSchema(getChatsSchema), getChats);

// delete all chats in a chat room
router.delete(
  "/all/delete/:chatRoomId",
  isUserAuthenticated,
  validateSchema(deleteAllChatsInRoomSchema),
  deleteAllChatsInRoom
);

export default router;
