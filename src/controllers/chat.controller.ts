import {
  generateAIResponse,
  generateImageResponse,
} from "../config/openaiConfig";
import { Chat } from "../model/chat.model";
import { Request, Response } from "express";
import { ChatRoom } from "../model/chatRoom.model";

// generate AI response
const getChatResponse = async (req: Request, res: Response) => {
  try {
    const { query, prevResponse, model } = req.body;
    if (!query) {
      res
        .status(400)
        .json({ status: false, message: "Did not find user query or prompt?" });
      return;
    }
    // generate AI response using OpenAI API
    const aiResponse = await generateAIResponse({ query, prevResponse, model });
    if (!aiResponse) {
      res
        .status(500)
        .json({ status: false, message: "Failed to generate AI response" });
      return;
    }
    res.status(200).json({
      message: "AI response generated successfully",
      response: aiResponse,
    });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// get all chats
const getChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const chatRoomId = req.params.chatRoomId; // get chat room id from params
    if (!chatRoomId) {
      res.status(400).json({ status: false, message: "Did not get chats?" });
      return;
    }
    // get all chats for the given chat room id
    const chats = await Chat.find({ chatRoomId });
    res.status(200).json({ message: "Chats fetched successfully", chats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// create chat
const createChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, usedModel, chatId, role } = req.body;
    const chatRoomId = req.params.chatRoomId; // get chat room id from params
    console.log({ content, usedModel, chatId, role, chatRoomId });
    if (!content || !usedModel || !chatId || !chatRoomId || !role) {
      res.status(400).json({
        status: false,
        message: "Check if you have enter prompt and select any model",
      });
      return;
    }
    // create a new chat
    const newChat = await Chat.create({
      chatId,
      role: role,
      content: content,
      chatRoomId: chatRoomId,
      usedModel,
    });
    res
      .status(201)
      .json({ message: "Chat created successfully", chat: newChat });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// get all chat rooms
const getChatRooms = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id; // here userId is coming from the auth middleware
    console.log("user id from get chat rooms controller:=> ", userId);
    if (!userId) {
      res
        .status(400)
        .json({ status: false, message: "User authentication failed." });
      return;
    }
    const chatRooms = await ChatRoom.find({ userId });
    res
      .status(200)
      .json({ message: "Chat rooms fetched successfully", chatRooms });
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res.status(500).json({
      status: false,
      massage: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// create chat room
const createChatRoom = async (req: Request, res: Response) => {
  try {
    const { chatRoomName, chatRoomId } = req.body;
    const userId = req.user?._id; // here userId is coming from the auth middleware
    console.log(userId);
    if (!chatRoomName || !userId || !chatRoomId) {
      res
        .status(400)
        .json({ status: false, message: "User authentication failed." });
      return;
    }

    // Create a new chat room
    const newChatRoom = await ChatRoom.create({
      chatRoomId,
      chatRoomName,
      userId,
    });
    // console.log("new chat room created", newChatRoom);
    res.status(201).json({
      message: "Chat room created successfully",
      chatRoom: newChatRoom,
    });
  } catch (error) {
    console.error("Error creating chat room:", error);
    res.status(500).json({
      stauts: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};


// generate image controller
const imageGenerate = async (req: Request, res: Response) => {
  try {
    const { prompt, model } = req.body;
    if (!prompt) {
      res.status(400).json({
        status: false,
        message: "Prompt is required to generate an image.",
      });
      return 
    }

    const imageResponse = await generateImageResponse({ prompt, model });
    if (!imageResponse) {
      res.status(500).json({
        status: false,
        message: "Failed to generate image.",
      });
      return 
    }

    res.status(200).json({
      status: true,
      message: "Image generated successfully.",
      data: imageResponse,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export { createChat, createChatRoom, getChats, getChatRooms, getChatResponse, imageGenerate };
