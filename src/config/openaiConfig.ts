import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config({
  path: "./.env",
});

const openai = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL,
  apiKey: process.env.OPENROUTER_API_KEY,
  // defaultHeaders: {
  //   "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
  //   "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  // }
});

const SYSTEM_PROMPT =
  "You are a helpful assistant. pretent your self as MindMap.ai. This is your name or identity.";

async function generateAIResponse({
  query,
  prevResponse,
  model,
}: IGenerateAIResponseParams) {
  try {
    const completion = await openai.chat.completions.create({
      model: model ? model : "mistralai/mistral-small-3.1-24b-instruct:free",
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}  ${prevResponse ? `your previous response "${prevResponse}" Use the previous response as the context for the current conversation. 
          Always refer to the previous response to maintain continuity and provide accurate and relevant answers. 
          If the user asks a follow-up question, ensure your response aligns with the context established in the previous interaction.`: ""}`,
        },
        {
          role: "user",
          content: `{ type: "user", user: "${query}" }`,
        },
      ],
      // response_format: {
      //   type: "json_schema",
      //   json_schema: {
      //     name: "llm-chat",
      //     strict: true,
      //     schema: {
      //       type: "object",
      //       properties: {
      //         location: {
      //           type: "string",
      //           description: "City or location name",
      //         },
      //         temperature: {
      //           type: "number",
      //           description: "Temperature in Celsius",
      //         },
      //         conditions: {
      //           type: "string",
      //           description: "Weather conditions description",
      //         },
      //       },
      //       required: ["location", "temperature", "conditions"],
      //       additionalProperties: false,
      //     },
      //   },
      // },
    });
    console.log("---Response---");
    console.log(completion);
    console.log("---Response---");
    return completion;
  } catch (error) {
    console.log("---Error---");
    console.error("Error generating response:", error);
    console.log("---Error---");
  }
}

export { generateAIResponse, openai };
