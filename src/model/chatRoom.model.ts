import mongoose, { Schema } from "mongoose";

const ChatRoomSchema = new Schema<IChatRoom>(
  {
    chatRoomId: { type: String, required: true, unique: true },
    chatRoomName: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export const ChatRoom = mongoose.model<IChatRoom>("ChatRoom", ChatRoomSchema);
