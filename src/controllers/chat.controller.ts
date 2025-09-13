import { Chat } from "../model/chat.model";
import { Request, Response } from "express";
import {
  CreateChatInput,
  DeleteAllChatsInRoomInput,
  GetChatsInput,
} from "../validations/chat.validation";
import { errorHandler, ErrorResponse } from "../handlers/handleErrorResponse";
import {
  SuccessResponse,
  successHandler,
} from "../handlers/handleSuccessResponse";
import {logger} from "../config/logger.config"

// get all chats
export const getChats = async (
  req: Request,
  res: Response<SuccessResponse<IChat[]> | ErrorResponse>
): Promise<void> => {
  try {
    const validated = (req as any).validated as
      | { params?: GetChatsInput }
      | undefined;
    const chatRoomId = validated?.params?.chatRoomId ?? req.params.chatRoomId; // get chat room id from params
    if (!chatRoomId) {
      logger.error("chat room id is required to get chats")
      res
        .status(400)
        .json(errorHandler.missingField("chatRoomId") as ErrorResponse);
      return;
    }
    // get all chats for the given chat room id
    const chats = await Chat.find({ chatRoomId });
    res
      .status(200)
      .json(
        successHandler.create(
          "Chats fetched successfully",
          chats
        ) as SuccessResponse<IChat[]>
      );
  } catch (error) {
    logger.error("Error fetching chats:", error);
    errorHandler.serverError("Error fetching chats", error);
  }
};

// create chat
export const createChat = async (
  req: Request,
  res: Response<SuccessResponse<IChat> | ErrorResponse>
): Promise<void> => {
  try {
    const validated = (req as any).validated as CreateChatInput;
    const { params, body } = validated;
    const { chatRoomId } = params;
    const { prompt, usedModel, chatId, role, fileUrls } = body;
    if (!prompt || !usedModel || !chatId || !chatRoomId || !role) {
      logger.error("prompt, usedModel, chatId, role, or chatRoomId missing in request");
      res
        .status(400)
        .json(
          errorHandler.missingField(
            "prompt, usedModel, chatId, role, chatRoomId"
          )
        );
      return;
    }
    // create a new chat
    const newChat = await Chat.create({
      chatId,
      role: role,
      content: [
        {
          fileUrls: fileUrls ? JSON.parse(fileUrls) : [], // optional field for file URLs
          content: prompt,
          type: "text", // assuming the content is text, can be changed based on requirements
          model: usedModel,
        },
      ],
      chatRoomId: chatRoomId,
    });
    res
      .status(201)
      .json(successHandler.create("Chat created successfully", newChat));
  } catch (error) {
    logger.error("Error creating chat:", error);
    res
      .status(500)
      .json(
        errorHandler.serverError(
          error instanceof Error ? error.message : "Unknown error",
          error
        )
      );
  }
};

// delete all chats in a chat room
export const deleteAllChatsInRoom = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validated = (req as any).validated as
      | { params?: DeleteAllChatsInRoomInput }
      | undefined;
    const chatRoomId = validated?.params?.chatRoomId ?? req.params.chatRoomId;
    if (!chatRoomId) {
      logger.error("chatRoomId is required to delete all chats in a chat room")
      res
        .status(400)
        .json(
          errorHandler.notFound(
            "chatRoomId is required to delete all chats in a chat room"
          )
        );
      return;
    }
    const result = await Chat.deleteMany({ chatRoomId });
    res
      .status(200)
      .json(
        successHandler.create("Chats deleted successfully", result.deletedCount)
      );
  } catch (error) {
    logger.error("Error deleting chats in chat room:", error);
    res
      .status(500)
      .json(
        errorHandler.serverError(
          error instanceof Error ? error.message : "Unknown error",
          error
        )
      );
  }
};
