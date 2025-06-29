import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config({
  path: "./.env",
});

// openai configure for ai chat
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

type Book = {
  id: number;
  title: string;
  authors: any[];
};

async function searchGutenbergBooks(searchTerms: string[]): Promise<Book[]> {
  const searchQuery = searchTerms.join(" ");
  const url = "https://gutendex.com/books";
  const response = await fetch(`${url}?search=${searchQuery}`);
  const data = (await response.json()) as { results: any[] };

  return data.results.map((book: any) => ({
    id: book.id,
    title: book.title,
    authors: book.authors,
  }));
}

const tools = [
  {
    type: "function" as const,
    function: {
      name: "searchGutenbergBooks",
      description:
        "Search for books in the Project Gutenberg library based on specified search terms",
      parameters: {
        type: "object",
        properties: {
          search_terms: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "List of search terms to find books in the Gutenberg library (e.g. ['dickens', 'great'] to search for books by Dickens with 'great' in the title)",
          },
        },
        required: ["search_terms"],
      },
    },
  },
];

const TOOL_MAPPING = {
  searchGutenbergBooks,
};

import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

let messages: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: SYSTEM_PROMPT,
  },
];

async function generateAIResponse({
  query,
  prevResponse,
  model,
}: IGenerateAIResponseParams) {
  try {
    console.log("prevResponse: ", prevResponse);
    if (prevResponse.length) {
      messages.push(...JSON.parse(prevResponse));
      messages.push({
        role: "user",
        content: query,
      });
    } else {
      messages = [
        {
          role: "user",
          content: query,
        },
      ];
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        tools,
        messages,
      }),
    });

    const completion = (await res.json()) as {
      choices: Array<{
        message: any;
      }>;
    };

    console.log("---Response---");
    // console.log(completion);
    console.log("message : ", completion.choices[0].message);
    console.log("llm response : ", completion.choices[0].message.tool_calls);
    console.log("---Response---");
    return completion;
  } catch (error) {
    console.log("---Error---");
    console.error("Error generating response:", error);
    console.log("---Error---");
  }
}

/* 

const completion = await openai.chat.completions.create({
      model: model ? model : "mistralai/mistral-small-3.1-24b-instruct:free",
      // messages: [
      //   {
      //     role: "system",
      //     content: `${SYSTEM_PROMPT}  ${
      //       prevResponse
      //         ? `your previous response "${prevResponse}" Use the previous response as the context for the current conversation.
      //     Always refer to the previous response to maintain continuity and provide accurate and relevant answers.
      //     If the user asks a follow-up question, ensure your response aligns with the context established in the previous interaction.`
      //         : ""
      //     }`,
      //   },
      //   {
      //     role: "user",
      //     content: `{ type: "user", user: "${query}" }`,
      //   },
      // ],
      messages: messages,
      tools: tools,
    });

*/

// oepnai configure for generate image
const client = new OpenAI({
  baseURL: process.env.NEBIUS_BASE_URL,
  apiKey: process.env.NEBIUS_API_KEY,
});

async function generateImageResponse({
  model = "stability-ai/sdxl",
  prompt,
}: {
  model?: string;
  prompt: string;
}) {
  const imagesResponse = await client.images.generate({
    model: "black-forest-labs/flux-dev",
    prompt,
  });
  return imagesResponse;
}

export { generateAIResponse, openai, generateImageResponse };
