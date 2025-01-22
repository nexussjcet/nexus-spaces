import { createGroq } from "@ai-sdk/groq";
import { CoreMessage, streamText, generateText, generateId } from "ai";
import { addMessage, getConversation, updateTitle } from "./db/models/conversations";

async function imageParts(imageList: string[]) {
  if (!imageList)
    return [];
  const images: { type: "image", image: string }[] = [];
  for await (const image of imageList) {
    images.push({ type: "image", image: image });
  };
  return images;
}

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});


export async function generateTitle(message: CoreMessage) {
const model = groq("llama-3.3-70b-versatile");

  const { text } = await generateText({
    model,
    system: `
        Generate a short title consisting of at most 5 words from the given prompt.
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
  const model = groq("llama-3.2-90b-vision-preview");
  const system = `
    You are a helpful AI agent called Spacey. You are part of a social media website called Nexus Spaces, developed by students of SJCET palai. Nexus Spaces is an AI driven social media website, where users can discover other users or posts by prompting you.

    Key Requirements:
    1. Generate short and to the point responses.
    2. Answer questions directly and in a way that is easy to understand.
    `;
  
  const messages: CoreMessage[] = [];

  // Pass previous messages to model
  const prevMessages = await getConversation(convId);
  await Promise.all(prevMessages.messages.map(async (item) => {
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
  }));

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
    // system, System prompt will not work on this model
    messages,
    onFinish: async (event) => {
      // Add assistant messages to db
      await addMessage(convId, {
        id: chatId,
        content: { text: event.text },
        isUser: false,
      });
    },
  });

  // Generates a title
  if (prevMessages.messages.length < 2) {
    await updateTitle(convId, await generateTitle(message));
  }
  for await (const chunk of aiResponse.fullStream) {
    yield chunk;
  }
}