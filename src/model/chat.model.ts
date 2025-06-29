import mongoose, { Schema } from "mongoose";

const chatSchema: Schema<IChat> = new Schema(
  {
    chatId: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ["user", "assistant"] },
    // content: { type: String, required: true },
    content: [
      {
        content: { type: String, required: true },
        type: { type: String, required: true, enum: ["text", "image"] },
        model: { type: String, required: true },
      }
    ],
    chatRoomId: { type: String, required: true },
    
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
