import { createGroq } from "@ai-sdk/groq";
import { CoreMessage, streamText, generateText } from "ai";
import { addMessage } from "./db/models/messages";
import { updateTitle } from "./db/models/chats";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const model = groq("llama-3.3-70b-versatile");

export async function generateTitle(prompt: string) {
  const { text } = await generateText({
    model,
    system: `
        Generate a short title consisting of at most 3 words from the given prompt.
        `,
    prompt,
  });

  return text;
}

export async function streamAIResponse(
  messages: CoreMessage[],
  chatId: string,
) {
  const system = `
    You are a helpful AI agent called Spacey. You are part of a social media website called Nexus Spaces, developed by students of SJCET palai. Nexus Spaces is an AI driven social media website, where users can discover other users or posts by prompting you.

    Key Requirements:
    1. Generate short and to the point responses.
    2. Answer questions directly and in a way that is easy to understand.
    `;

  return streamText({
    model,
    system,
    messages,
    onFinish: async (event) => {
      await addMessage({
        chatId,
        role: "system",
        content: event.text,
      });

      if (messages.length === 1) {
        await updateTitle(chatId, await generateTitle(event.text));
      }
    },
  });
}
