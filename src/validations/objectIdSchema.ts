import { z } from "zod";
import { Types } from "mongoose"

export const objectIdSchema = z.union([
  z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "_id must be a valid ObjectId string",
  }),
  z.instanceof(Types.ObjectId),
]);