import { createGroq } from "@ai-sdk/groq";
import { CoreMessage, generateText, streamText, tool } from "ai";
import { getConversation, updateTitle } from "./db/models/conversations";
import { z } from "zod";
import { getSimilarUsers } from "./db/models/users";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

async function imageParts(imageList: string[]) {
  if (!imageList)
    return [];
  const images: { type: "image", image: string }[] = [];
  for await (const image of imageList) {
    images.push({ type: "image", image: image });
  };
  return images;
}

export async function generateTitle(message: string) {
  const model = groq("llama-3.3-70b-versatile");
  const { text } = await generateText({
    model,
    system: `
      Generate a short title consisting of at most 5 words from the given prompt. It must be unique and meaningful.
      You don't need to answer to any of the questions asked by the user. Just generate a title based on the prompt.
      Also don't include any special characters in the title.
    `,
    prompt: message,
  });
  return text;
}

export async function* streamAIResponse(
  convId: string,
  prompt: { id: string, content: { text: string, files: string[] } }
) {
  const model = groq("deepseek-r1-distill-llama-70b");
  const system = `
    You are a helpful AI agent called Spacey. You are part of a social media website called Nexus Spaces, developed by students of SJCET palai. Nexus Spaces is an AI driven social media website, where users can discover other users or posts by prompting you.

    Key Requirements:
    1. Generate short and to the point responses.
    2. Answer questions directly and in a way that is easy to understand.
    3. If the user asks about a user or wants to find other users, use the findSimilarProfiles tool. Enclose all the users in an array within <users></users> tags.
    4. NEVER SHOW MORE USERS THAN WHAT THE TOOL CALL RETURNS
    5. Ensure the <users></users> tag is placed at the end.

    Definition of <user>:
    Anytime you generate a user based on the findSimilarProfiles tool, ensure it follows this format:
    <users>
    [{"name": "username", "email": "user email", "image": "user image", "bio": "user bio"}, {"name": "username", "email": "user email", "image": "user image", "bio": "user bio"}]
    </users>
    `;

  const messages: CoreMessage[] = [];

  // Pass previous messages to model
  const prevMessages = await getConversation(convId);
  for await (const item of prevMessages.messages) {
    if (item.isUser) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: item.content.text,
          },
          ...await imageParts(item.content.files!),
        ]
      } as CoreMessage);
    } else {
      messages.push({
        role: "assistant",
        content: [
          {
            type: "text",
            text: item.content.text,
          },
        ]
      } as CoreMessage);
    }
  };

  // Pass current messages to model
  const message = {
    role: "user",
    content: [
      {
        type: "text",
        text: prompt.content.text
      },
      ...await imageParts(prompt.content.files!)
    ]
  } as CoreMessage;
  messages.push(message);

  // Execute the AI model
  const aiResponse = streamText({
    model,
    system,
    messages,
    tools: {
      findSimilarProfiles: tool({
        description: "This tool is used to find the most similar profiles for a given search query",
        parameters: z.object({
          search: z.string().describe("A search string used to find the most relevant profiles. Can be a word or a sentence.")
        }),
        execute: async ({search}) => {
          console.log("finding users")
          const users = await getSimilarUsers(search);
          console.log(users)
          return JSON.stringify(users)
        }
      })
    },
    maxSteps: 2
  });

  // Generates a title
  if (!prevMessages.title.updated) {
    await updateTitle(convId, await generateTitle(prompt.content.text));
  }

  for await (const chunk of aiResponse.fullStream) {
    if (chunk.type === "text-delta") {
      yield { type: "text", text: chunk.textDelta, streaming: true };
    }
    if (chunk.type === "finish") {
      yield { type: "text", text: "", streaming: false };
    }
  }
}