import { Document, mongo } from "mongoose";
import OpenAI from "openai";
import { Response, Request } from "express";

export { IUser, IChatRoom };

declare global {
  interface IChat extends Document {
    chatId: string;
    role: "user" | "assistant";
    // content: string;
    content: {
      content: string;
      type: "text" | "image";
      model: string;
    }[];
    chatRoomId: string;
  }

  interface IChatRoom extends Document {
    chatRoomId: string;
    chatRoomName: string;
    userId: mongo.ObjectId;
  }

  interface IGeneratedImg extends Document {
    id: string;
    imgUrl: string;
    role: "assistant";
    chatRoomId: string;
    usedModel: string;
  }

  interface IUser extends Document {
    name: string;
    authType: "google" | "github" | "email";
    email: string;
    password: string;
    profilePic: string;
    dob: string;
    refreshToken: string;
    isPasswordCorrect: (enteredPassword: string) => Promise<boolean>;
    generateRefreshToken: () => Promise<string>;
    generateAccessToken: () => Promise<string>;
  }

  interface IGenerateAIResponseParams {
    query: string;
    prevResponse: string;
    model?: string;
  }

  // async function generateAIResponse<IGenerateAIResponseParams>(
  //   query: string
  // ): Promise<OpenAI.Chat.CompletionCreateParams.Response> {
  //   return Promise.resolve({} as OpenAI.Chat.CompletionCreateParams.Response);
  // }

  const getChats: (req: Request, res: Response) => Promise<Response>;

  // Extend the Request interface to include the user property
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }


  interface IMessage {
    role: "user" | "assistant" | "system" | "function" | "tool";
    content: string;
  }
}
