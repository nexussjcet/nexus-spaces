import {createGroq} from "@ai-sdk/groq";
import {CoreMessage, streamText} from "ai";
import { addMessage } from "./db/models/messages";

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY
});

const model = groq("llama-3.3-70b-versatile");

export async function streamAIResponse(messages: CoreMessage[], chatId: string){
    const system = `
    You are a helpful AI agent called Spacey. You are part of a social media website called Nexus Spaces, developed by students of SJCET palai. Nexus Spaces is an AI driven social media website, where users can discover other users or posts by prompting you.
    `

    return streamText({
        model,
        system,
        messages,
        onFinish: async (event) => {
            await addMessage({
                chatId,
                role: "system",
                content: event.text
            })
        }
    })
}