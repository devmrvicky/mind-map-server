import OpenAI from "openai";
import { readFile } from "fs/promises";
import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";

// Configure dotenv to load environment variables from the .env file
dotenv.config({
  path: "./.env",
});

const data = await readFile("./studentsData.json", "utf-8");
const studentsData = JSON.parse(data);
// console.log(studentsData);
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieparser());

const openai = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL,
  apiKey: process.env.OPENROUTER_API_KEY,
  // defaultHeaders: {
  //   "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
  //   "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  // }
});

const SYSTEM_PROMPT = `You are a helpful assistant. pretent your self as MindMap.ai. This is your name or identity.`;

async function generateAIResponse(query, prevResponse, model) {
  try {
    const completion = await openai.chat.completions.create({
      model: model ? model : "mistralai/mistral-small-3.1-24b-instruct:free",
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}  your previous response "${prevResponse}" Use the previous response as the context for the current conversation. 
          Always refer to the previous response to maintain continuity and provide accurate and relevant answers. 
          If the user asks a follow-up question, ensure your response aligns with the context established in the previous interaction.`,
        },
        {
          role: "user",
          content: `{ "type": "user", "user": "${query}" }`,
        },
      ],
      response_format: {
        type: "json_schema",
      },
    });
    console.log("---Response---");
    console.log(completion);
    console.log("---Response---");
    return completion;
    // if (completion?.choices[0]?.message.content) {
    // } else {
    //   console.log(completion.message);
    // }
  } catch (error) {
    console.log("---Error---");
    console.error("Error generating response:", error);
    console.log("---Error---");
  }
}

app.listen(3000, () => {
  console.log("listing server on 3000 port");
});

app.get("/", async (req, res) => {
  const response = await generateAIResponse();
  res.json(response);
});

app.get("/test", (req, res) => {
  res.json({ message: "Test route is working!" });
});

app.post("/generate-response", async (req, res) => {
  // console.log("req", req.body);
  // return;
  const { query, prevResponse, model } = req.body;
  // console.log("query", query);
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }
  try {
    const response = await generateAIResponse(query, prevResponse, model);
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error in /generate-response:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
