import { CoreMessage } from "ai";
import { HfInference } from "@huggingface/inference";
import { getConversation, updateTitle } from "./db/models/conversations";

const hf = new HfInference(process.env.HF_API_KEY);

async function imageParts(imageList: string[]) {
  if (!imageList)
    return [];
  const images: { type: "image_url", image_url: any }[] = [];
  for await (const image of imageList) {
    images.push({ type: "image_url", image_url: { url: image } });
  };
  return images;
}

export async function generateTitle(message: CoreMessage) {
  const model = "meta-llama/Llama-3.2-3B-Instruct";
  const system = "Generate a short title consisting of at most 3 words from the given prompt.";
  const aiResponse = hf.chatCompletion({
    model,
    system,
    messages: [message],
    temperature: 0.5,
    max_tokens: 2048,
    top_p: 0.7,
  });
  return (await aiResponse).choices[0].message.content || "Untitled";
}

export async function* streamAIResponse(
  convId: string,
  prompt: any,
) {
  const model = "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B";
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
  const aiResponse = hf.chatCompletionStream({
    model,
    system,
    messages,
    temperature: 0.5,
    max_tokens: 2048,
    top_p: 0.7,
  });

  // Generates a title
  if (prevMessages.messages.length < 2) {
    await updateTitle(convId, await generateTitle(message));
  }
  for await (const chunk of aiResponse) {
    if (chunk.choices && chunk.choices.length > 0) {
      const newContent = chunk.choices[0].delta.content;
      yield { type: "text", text: newContent };
    }
  }
}