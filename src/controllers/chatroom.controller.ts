import { ChatRoom } from "../model/chatRoom.model";
import { Request, Response } from "express";
import {
  CreateChatRoomInput,
  GetChatRoomInput,
  DeleteChatRoomInput,
} from "../validations/chatroom.validation";
import { errorHandler, ErrorResponse } from "../handlers/handleErrorResponse";
import {
  SuccessResponse,
  successHandler,
} from "../handlers/handleSuccessResponse";
import { logger } from "../config/logger.config";

// get all chat rooms
export const getChatRooms = async (
  req: Request,
  res: Response<SuccessResponse<IChatRoom[]> | ErrorResponse>
): Promise<void> => {
  try {
    const validate = (req as any).validated as GetChatRoomInput;
    const userId = validate.user._id;
    if (!userId) {
      logger.error("User ID missing in request");
      res
        .status(401)
        .json(
          errorHandler.authError("User authentication failed.") as ErrorResponse
        );
      return;
    }

    const chatRooms = await ChatRoom.find({ userId });
    res
      .status(200)
      .json(
        successHandler.create("Chat rooms fetched successfully", chatRooms)
      );
  } catch (error) {
    logger.error("Error fetching chat rooms:", error);
    res
      .status(500)
      .json(
        errorHandler.serverError(
          error instanceof Error ? error.message : "Unknown error",
          error
        ) as ErrorResponse
      );
  }
};

// create chat room
export const createChatRoom = async (
  req: Request,
  res: Response<SuccessResponse<IChatRoom> | ErrorResponse>
): Promise<void> => {
  try {
    const validated = (req as any).validated as CreateChatRoomInput;
    const { chatRoomName, chatRoomId } = validated.body;
    const userId = validated.user._id;

    if (!chatRoomName && !chatRoomId) {
      logger.error("chatRoomName or chatRoomId missing in request");
      res
        .status(400)
        .json(
          errorHandler.missingField(
            "chatRoomName or chatRoomId"
          ) as ErrorResponse
        );
      return;
    }
    if (!userId) {
      logger.error("User ID missing in request");
      res
        .status(401)
        .json(
          errorHandler.authError("User authentication failed.") as ErrorResponse
        );
      return;
    }

    // Create a new chat room
    const newChatRoom = await ChatRoom.create({
      chatRoomId,
      chatRoomName,
      userId,
    });

    res
      .status(201)
      .json(
        successHandler.create("Chat room created successfully", newChatRoom)
      );
  } catch (error) {
    logger.error("Error creating chat room:", error);
    res
      .status(500)
      .json(
        errorHandler.serverError(
          error instanceof Error ? error.message : "Unknown error",
          error
        ) as ErrorResponse
      );
  }
};

// delete chat room
export const deleteChatRoom = async (
  req: Request,
  res: Response<SuccessResponse<null> | ErrorResponse>
): Promise<void> => {
  try {
    const validate = (req as any).validated as DeleteChatRoomInput;
    const {chatRoomId} = validate.params;
    if (!chatRoomId) {
      logger.error("chatRoomId missing in request");
      res
        .status(400)
        .json(errorHandler.missingField("chatRoomId") as ErrorResponse);
      return;
    }

    const deletedRoom = await ChatRoom.findOneAndDelete({ chatRoomId });
    if (!deletedRoom) {
      logger.error("chat room not found");
      res
        .status(404)
        .json(errorHandler.notFound("Chat room not found.") as ErrorResponse);
      return;
    }

    res
      .status(200)
      .json(successHandler.create("Chat room deleted successfully", null));
  } catch (error) {
    logger.error("Error deleting chat room:", error);
    res
      .status(500)
      .json(
        errorHandler.serverError(
          error instanceof Error ? error.message : "Unknown error",
          error
        ) as ErrorResponse
      );
  }
};
