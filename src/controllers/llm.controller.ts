import { Request, Response } from "express";
import { openRouterService } from "../services/openrouter.service";
import { nebiusService } from "../services/nebius.service";
import {
  GenerateTextInput,
  GenerateStreamInput,
  GenerateImageInput,
} from "../validations/llm.validation";
import { errorHandler, ErrorResponse } from "../handlers/handleErrorResponse";
import {
  SuccessResponse,
  successHandler,
} from "../handlers/handleSuccessResponse";
import { logger } from "../config/logger.config";

/**
 * generate AI response
 */
export const generateText = async (
  req: Request,
  res: Response<SuccessResponse<any> | ErrorResponse>
): Promise<void> => {
  try {
    const validate = (req as any).validated as GenerateTextInput;
    const { prompt, usedModel, fileUrls } = validate.body;
    logger.info("body", { prompt, usedModel, fileUrls });
    if (!prompt) {
      logger.error("prompt is missing in request");
      res
        .status(400)
        .json(errorHandler.missingField("prompt") as ErrorResponse);
      return;
    }

    const aiResponse = await openRouterService.getTextResponse({
      prompt,
      model: usedModel,
      fileUrls: fileUrls ? JSON.parse(fileUrls) : [],
    });

    if (!aiResponse) {
      logger.error("failed to generate AI response");
      res
        .status(500)
        .json(
          errorHandler.serverError(
            "Failed to generate AI response"
          ) as ErrorResponse
        );
      return;
    }

    res
      .status(200)
      .json(
        successHandler.create("AI response generated successfully", aiResponse)
      );
  } catch (error) {
    logger.error("Error generating AI response:", error);
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

/**
 * generate stream response (SSE)
 */
export const generateStreamText = async (
  req: Request,
  res: Response<SuccessResponse<any> | ErrorResponse>
): Promise<void> => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const validate = (req as any).validated as GenerateStreamInput;
  const { prompt } = validate.query;
  const { usedModel, fileUrls } = validate.body;

  if (!prompt) {
    logger.error("prompt is missing in request");
    res.write(
      `event: error\ndata: ${JSON.stringify({ error: "No prompt" })}\n\n`
    );
    res.end();
    return;
  }

  const response = await openRouterService.getOpenrouterRes({
    prompt,
    model: usedModel,
    fileUrls: fileUrls ? JSON.parse(fileUrls) : [],
    stream: true,
  });

  if (!response) {
    logger.error("No response generated");
    res.write(
      `event: error\ndata: ${JSON.stringify({ error: "No response" })}\n\n`
    );
    res.end();
    return;
  }

  if (response.status !== 200) {
    const errorText = response.data;
    logger.error("OpenRouter Error:", errorText);
    res.write(
      `event: error\ndata: ${JSON.stringify({ error: errorText })}\n\n`
    );
    res.end();
    return;
  }

  if (!response.data) {
    res.end();
    return;
  }

  const decoder = new TextDecoder();
  for (const chunk of response.data) {
    const lines = decoder.decode(chunk).split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice("data: ".length).trim();
        if (data === "[DONE]") {
          res.write("event: done\ndata: [DONE]\n\n");
          res.end();
          return;
        }
        res.write(`data: ${data}\n\n`);
      }
    }
  }
};

/**
 * generate image
 */
export const generateImage = async (
  req: Request,
  res: Response<SuccessResponse<any> | ErrorResponse>
): Promise<void> => {
  try {
    const validate = (req as any).validated as GenerateImageInput;
    const { prompt, model } = validate.body;
    if (!prompt) {
      logger.error("prompt is missing in request");
      res
        .status(400)
        .json(errorHandler.missingField("prompt") as ErrorResponse);
      return;
    }

    const imageResponse = await nebiusService.generateImage({ prompt, model });
    if (!imageResponse) {
      logger.error("Failed to generate image");
      res
        .status(500)
        .json(
          errorHandler.serverError("Failed to generate image") as ErrorResponse
        );
      return;
    }

    res
      .status(200)
      .json(
        successHandler.create("Image generated successfully", imageResponse)
      );
  } catch (error) {
    logger.error("Error generating image:", error);
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
