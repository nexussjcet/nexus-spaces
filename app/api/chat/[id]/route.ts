import { NextRequest, NextResponse } from "next/server";
import { createConversation, deleteConversation, getConversation, addMessage } from "@/lib/db/models/conversations";
import { streamAIResponse } from "@/lib/agent";

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
  if (action === "create") { // Creates new conversation
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
  } else if (action === "delete") { // Delete a conversation
    const { convId } = await request.json();
    deleteConversation(convId);
    return NextResponse.json({ success: true, message: "Conversation deleted" });
  } else if (action === "ai") { // Call AI model
    const { prompt } = await request.json();
    let dbFormat;
    if (prompt.content.files && prompt.content.files.length > 0)
      dbFormat = { id: prompt.id, content: { text: prompt.content.text, files: prompt.content.files }, isUser: true };
    else
      dbFormat = { id: prompt.id, content: { text: prompt.content.text }, isUser: true };
    addMessage(id, dbFormat); // Add user message to db
    const chatId = `assitant-${Date.now().toString()}`;
    const aiResponse = streamAIResponse(id, chatId, prompt);

    // Create a new ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of aiResponse) {
            let response;
            if (chunk.type === "text-delta") {
              const jsonData = { success: true, id: chatId, data: chunk.textDelta };
              response = JSON.stringify(jsonData) + "{%%}"; // {%%} is a delimiter that indicates the end of the response
            }
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