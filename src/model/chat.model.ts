import mongoose, { Schema } from "mongoose";

const chatSchema: Schema<IChat> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ["user", "assistant"] },
    content: { type: String, required: true },
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
    },
    usedModel: { type: String, required: true },
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
