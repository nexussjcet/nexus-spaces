import { addMessage, getMessages } from "@/lib/db/models/messages";
import { streamAIResponse } from "@/lib/agent";

export async function GET(request: Request, {params}: {params: Promise<{id: string}>}){
    const id = (await params).id;
    return Response.json({
        messages: await getMessages(id)
    });
}

export async function POST(request: Request, {params}: {params: Promise<{id: string}>}){
    const id = (await params).id;
    const {messages} = await request.json();

    await addMessage({
        chatId: id,
        role: "user",
        content: messages.at(-1).content
    });

    const result = await streamAIResponse(messages, id);

    return result.toDataStreamResponse();
}