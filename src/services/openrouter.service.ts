import { ChatCompletionMessageParam } from "openai/resources/chat";
import { openrouter } from "../config/openrouter.config";
import { getPrevResponses } from "../utils/handlePrevResponse";

class OpenRouter {
  private SYSTEM_PROMPT: string;
  private prevResponse: ChatCompletionMessageParam[];

  constructor() {
    this.SYSTEM_PROMPT =
      "You are a helpful assistant. pretent your self as MindMap.ai. This is your name or identity.";
    this.prevResponse = getPrevResponses();
  }

  async getOpenrouterRes({
    prompt,
    model,
    fileUrls,
    stream = false
  }: IGenerateAIResponseParams) {
    let messages: ChatCompletionMessageParam[] = [
      { role: "system", content: this.SYSTEM_PROMPT },
    ];

    if (this.prevResponse.length) {
      messages.push(...this.prevResponse);
    }
    if (fileUrls && fileUrls.length) {
      console.log("fileUrl from : ", fileUrls);
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
      const res = await openrouter.post("/api/v1/chat/completions", {
        model: model || "mistralai/mistral-small-3.2-24b-instruct:free",
        models: [
          "deepseek/deepseek-r1-0528:free",
          "deepseek/deepseek-r1:free",
          "google/gemma-3-12b-it:free",
        ],
        // tools,
        messages,
        stream
      });
      return res
    } catch (error) {
      throw new Error(error instanceof  Error ? error.message : "unknown error")
    }


  }

  async getTextResponse({
    prompt,
    model,
    fileUrls,
  }: IGenerateAIResponseParams) {
    try {
      const res = await this.getOpenrouterRes({prompt, model, fileUrls})
      if (res.status !== 200) throw new Error("Unable to generate response.");

      const completion = res.data;

      console.log("---Response---");
      // console.log(completion);
      console.log("message : ", completion);
      // // console.log("llm response : ", completion.choices[0].message.tool_calls);
      console.log("---Response---");
      return completion;
      // return false;
    } catch (error) {
      console.log("---Error---");
      console.error("Error generating response:", error);
      console.log("---Error---");
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  }
}
  


export const openRouterService = new OpenRouter();
