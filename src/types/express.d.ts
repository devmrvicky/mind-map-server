import "express";
import { ValidatedSchemaType } from "../validations/genericValidationSchema";
import { CreateChatInput, GetChatsInput } from "../validations/chat.validation";

declare module "express-serve-static-core" {
  interface Request {
    validated?: unknown;
  }
}
