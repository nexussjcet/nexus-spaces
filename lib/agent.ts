import { createGroq } from "@ai-sdk/groq";
import { CoreMessage, streamText, generateText, generateId } from "ai";
import { addMessage, getConversation, updateTitle } from "./db/models/conversations";
import { imageFormat, textFormat } from "./format";
import { Message } from "@/types";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const model = groq("llama-3.2-90b-vision-preview");

export async function generateTitle(message: CoreMessage) {
  const { text } = await generateText({
    model,
    system: `
        Generate a short title consisting of at most 3 words from the given prompt.
        `,
    messages: [message],
  });

  return text;
}

export async function* streamAIResponse(
  convId: string,
  chatId: string,
  prompt: any,
) {
  const system = `
    You are a helpful AI agent called Spacey. You are part of a social media website called Nexus Spaces, developed by students of SJCET palai. Nexus Spaces is an AI driven social media website, where users can discover other users or posts by prompting you.

    Key Requirements:
    1. Generate short and to the point responses.
    2. Answer questions directly and in a way that is easy to understand.
    `;
  const messages: CoreMessage[] = [];
  const prevMessages = await getConversation(convId);
  // xif (prevMessages.messages.length < 2) {
  //   await updateTitle(convId, await generateTitle(message));
  // }
  await prevMessages.messages.map(async (item) => {
    if (item.isUser) {
        messages.push({ role: "user", content: [...item.content] } as CoreMessage);
    } else {
      messages.push({ role: "assistant", content: [...item.content] } as CoreMessage);
    }
  });
  const message = { role: "user", content: [...prompt.content.text, ...prompt.content.files] } as CoreMessage;
  messages.push(message);
  const aiResponse = streamText({
    model,
    // system, System prompt will not work on this model
    messages,
    onFinish: async (event) => {
      await addMessage(convId, {
        id: chatId,
        content: [ ...await textFormat(event.text)],
        isUser: false,
      });
    },
  });
  for await (const chunk of aiResponse.fullStream) {
    yield chunk;
  }
}