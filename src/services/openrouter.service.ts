import { ChatCompletionMessageParam } from "openai/resources/chat";
import { openrouter } from "../config/openrouter.config";
import { logger } from "../config/logger.config";
import { env } from "../env/env";

class OpenRouter {
  private SYSTEM_MESSAGE: string;

  constructor() {
    this.SYSTEM_MESSAGE = env.SYSTEM_MESSAGE;
  }

  async getOpenrouterRes({
    prompt,
    model,
    fileUrls,
    stream = false,
    prevResponses,
  }: IGenerateAIResponseParams) {
    let messages: ChatCompletionMessageParam[] = [
      { role: "system", content: this.SYSTEM_MESSAGE },
    ];

    logger.info(`previous responses: ${prevResponses}`);
    if (prevResponses && prevResponses.length) {
      prevResponses.forEach((prevResponse) => {
        messages.push(prevResponse);
      });
    }
    if (fileUrls && fileUrls.length) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: fileUrls[0],
            },
          },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
        ],
      });
    }

    try {
      const res = await openrouter.post("/chat/completions", {
        model: model || "mistralai/mistral-small-3.2-24b-instruct:free",
        models: [
          "deepseek/deepseek-r1-0528:free",
          "deepseek/deepseek-r1:free",
          "google/gemma-3-12b-it:free",
        ],
        // tools,
        messages,
        stream,
      });
      return res;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "unknown error");
    }
  }

  async getTextResponse({
    prompt,
    model,
    fileUrls,
    prevResponses,
  }: IGenerateAIResponseParams) {
    try {
      const res = await this.getOpenrouterRes({
        prompt,
        model,
        fileUrls,
        prevResponses,
      });
      return res;
    } catch (error) {
      logger.info("---Error---");
      logger.error("Error generating response:", error);
      logger.info("---Error---");
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }
}

export const openRouterService = new OpenRouter();
