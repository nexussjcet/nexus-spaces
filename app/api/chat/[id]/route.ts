import { NextRequest, NextResponse } from "next/server";
import { createConversation, deleteConversation, getConversation, addMessage } from "@/lib/db/models/conversations";
import { streamAIResponse } from "@/lib/agent";
import { CoreMessage } from "ai";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const data = await getConversation(id);
  if (data) {
    return Response.json({
      success: true,
      message: "Conversation found",
      data,
    });
  }else{
    return NextResponse.json({ success: false, message: "Conversation not found" });
  }
}

export async function POST(
  request: NextRequest,
  { params }: {
    params: Promise<{ id: string }>
  }
) {
  const id = (await params).id;
  const action = request.nextUrl.searchParams.get("action");
  if (action === "create") {
    const { convId, convTitle, convTimestamp, userId } = await request.json();
    const data = {
      id: convId,
      title: convTitle,
      timestamp: convTimestamp,
      messages: [],
      userId: userId,
    };
    createConversation(data);
    return NextResponse.json({ success: true, message: "Conversation created", data });
  } else if (action === "delete") {
    const { convId } = await request.json();
    deleteConversation(convId);
    return NextResponse.json({ success: true, message: "Conversation deleted" });
  } else if (action === "ai") {
    const { prompt } = await request.json(); // Need to add files here
    addMessage(id, prompt);
    const message = { role: "user", content: [{ type: "text", text: prompt.content.text }] } as CoreMessage;
    const chatId = `assitant-${Date.now().toString()}`;
    const aiResponse = streamAIResponse(id, chatId, message);
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of aiResponse) {
            let response;
            if (chunk.type === "text-delta") {
              const jsonData = { success: true, id: chatId, data: chunk.textDelta };
              response = JSON.stringify(jsonData) + "{%%}";
            }// }else {
            //   const jsonData = {success: false, id: chatId, data: "Error Occurred"};
            //   response = JSON.stringify(jsonData) + "{%%}";
            // }
            controller.enqueue(new TextEncoder().encode(response));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "application/json", "Transfer-Encoding": "chunked" },
    });
  } else {
    return NextResponse.json({ success: false, message: "Invalid action" });
  }
}