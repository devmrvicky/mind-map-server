import { Request, Response } from "express";
import { ik } from "../config/imagekit.config";
import { env } from "../env/env";
import { errorHandler, ErrorResponse } from "../handlers/handleErrorResponse";
import {
  SuccessResponse,
  successHandler,
} from "../handlers/handleSuccessResponse";
import {
  ImagekitAuthInput,
  DeleteFileInput,
  DeleteFilesInput,
} from "../validations/imagekit.validation";
import { logger } from "../config/logger.config";

export const imagekitAuthentication = async (
  req: Request<ImagekitAuthInput>,
  res: Response<SuccessResponse<Record<string, any>> | ErrorResponse>
): Promise<void> => {
  try {
    const authenticationDetails = ik.getAuthenticationParameters();
    res.status(200).json(
      successHandler.create(
        "ImageKit authentication details retrieved successfully",
        {
          ...authenticationDetails,
          publicKey: env.IMAGEKIT_PUBLIC_KEY!,
        }
      )
    );
  } catch (error) {
    logger.error("Error in imagekitAuthentication:", error);
    res
      .status(500)
      .json(
        errorHandler.serverError(
          error instanceof Error
            ? error.message
            : "Failed to retrieve ImageKit authentication details",
          error
        )
      );
  }
};

/**
 * Delete single file by id
 */
export const deleteFile = async (
  req: Request<DeleteFileInput>,
  res: Response<SuccessResponse<any> | ErrorResponse>
): Promise<void> => {
  try {
    const validate = (req as any).validated as DeleteFileInput;
    const { fileId } = validate.body;
    if (!fileId) {
      logger.error("file id is missing in req");
      res.status(400).json(errorHandler.missingField("fileId"));
      return;
    }

    const fileData = await ik.deleteFile(fileId);
    res
      .status(200)
      .json(successHandler.create("File deleted successfully", fileData));
  } catch (error) {
    logger.error("Error in deleteFile:", error);
    res
      .status(500)
      .json(
        errorHandler.serverError(
          error instanceof Error ? error.message : "Failed to delete file",
          error
        )
      );
  }
};

/**
 * Bulk delete files. Expects fileIds as a JSON string in body.fileIds (controller previously JSON.parse(fileIds))
 */
export const deleteFiles = async (
  req: Request,
  res: Response<SuccessResponse<any> | ErrorResponse>
): Promise<void> => {
  try {
    const validate = (req as any).validated as DeleteFilesInput;
    const { fileIds } = validate.body;
    if (!fileIds) {
      logger.error("files' id are missing in req");
      res.status(400).json(errorHandler.missingField("fileIds"));
      return;
    }

    let parsedIds: string[] = [];
    try {
      const parsed = JSON.parse(fileIds);
      if (Array.isArray(parsed)) parsedIds = parsed;
      else throw new Error("fileIds must be a JSON array string");
    } catch (parseError) {
      res
        .status(400)
        .json(
          errorHandler.badRequest(
            "Invalid fileIds format. Expect JSON array string."
          )
        );
    }

    const fileData = await ik.bulkDeleteFiles(parsedIds);
    res
      .status(200)
      .json(successHandler.create("Files deleted successfully", fileData));
  } catch (error) {
    logger.error("Error in deleteFiles:", error);
    res
      .status(500)
      .json(
        errorHandler.serverError(
          error instanceof Error ? error.message : "Failed to delete files",
          error
        )
      );
  }
};
