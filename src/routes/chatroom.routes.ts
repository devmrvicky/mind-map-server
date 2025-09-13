import express from "express";
import {
  getChatRooms,
  createChatRoom,
  deleteChatRoom,
} from "../controllers/chatroom.controller";
import { isUserAuthenticated } from "../middlewares/auth.middleware";
import { validateSchema } from "../middlewares/validate.middleware";
import {
  createChatRoomSchema,
  getChatRoomSchema,
  deleteChatRoomSchema,
} from "../validations/chatroom.validation";

const router = express.Router();

// get all chat rooms for a user
router.get(
  "/",
  isUserAuthenticated,
  validateSchema(getChatRoomSchema),
  getChatRooms
);

// create a new chat room
router.post(
  "/create",
  isUserAuthenticated,
  validateSchema(createChatRoomSchema),
  createChatRoom
);

// delete a chat room
router.delete(
  "/delete/:chatRoomId",
  isUserAuthenticated,
  validateSchema(deleteChatRoomSchema),
  deleteChatRoom
);

export default router;
