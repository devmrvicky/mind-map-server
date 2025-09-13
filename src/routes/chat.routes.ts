import express from "express";
import {
  createChat,
  getChats,
  deleteAllChatsInRoom,
} from "../controllers/chat.controller";
import {
  generateText,
  generateStreamText,
} from "../controllers/llm.controller";
import { isUserAuthenticated } from "../middlewares/auth.middleware";
import {
  createChatSchema,
  getChatsSchema,
  deleteAllChatsInRoomSchema,
} from "../validations/chat.validation";
import {
  generateTextSchema,
  generateStreamSchema,
} from "../validations/llm.validation";
import { validateSchema } from "../middlewares/validate.middleware";

const router = express.Router();

// generate AI response using OpenRouter
router.post("/generate", validateSchema(generateTextSchema), generateText);

// generate stream response
router.get(
  "/stream-generate",
  validateSchema(generateStreamSchema),
  generateStreamText
);

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
