/*
  POST: /api/chat
    - Create a new chat message (ROLE: user) and save in db
    - generate a response (ROLE: assistant) using OpenAI API and again save it in db.

  POST: /api/chat/room
    - Create a new chat room and save in db (if not exists)
*/

import express, { Request, Response } from "express";

const router = express.Router();
import {
  createChat,
  createChatRoom,
  getChats,
  getChatRooms,
  getChatResponse,
} from "../controllers/chat.controller";
import { isUserAuthenticated } from "../middlewares/auth.middleware";
import validateObjectId from "../middlewares/validateObjectId.middleware";

// this router will get all chat rooms for a specific user
router.get("/room", isUserAuthenticated, getChatRooms);
// this router will create a new chat room and save it in db
router.post("/room/create", isUserAuthenticated, createChatRoom);
// this router will get all chats for a specific chat room
router.get("/:chatRoomId", getChats);
// this router will generate AI response using OpenAI and openrouter API
router.post("/generate", getChatResponse);
// this router will create a new chat (with role: user or assistant) and save it in db
router.post("/create/:chatRoomId", createChat);

export default router;
