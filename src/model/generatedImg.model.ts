import mongoose, { Schema } from "mongoose";

const GeneratedImgSchema: Schema<IGeneratedImg> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    imgUrl: { type: String, required: true },
    role: { type: String, required: true, enum: ["assistant"] },
    chatRoomId: { type: String, required: true },
    usedModel: { type: String, required: true },
  },
  { timestamps: true }
);

export const GeneratedImg = mongoose.model<IGeneratedImg>(
  "GeneratedImg",
  GeneratedImgSchema
);
