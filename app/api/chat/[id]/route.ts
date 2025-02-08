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
  } else {
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
    // Creates new conversation
    const { convId, userId } = await request.json();
    const data = {
      id: convId,
      title: { updated: false, text: "New Chat" },
      timestamp: new Date().toISOString(),
      messages: [],
      userId: userId,
    };
    createConversation(data);
    return NextResponse.json({ success: true, message: "Conversation created", data });
  } else if (action === "delete") {
    // Delete a conversation
    const { convId, userId } = await request.json(); // eslint-disable-line @typescript-eslint/no-unused-vars
    const data = {
      id: convId,
    }
    deleteConversation(convId);
    return NextResponse.json({ success: true, message: "Conversation deleted", data });
  } else if (action === "ai") {
    // Call AI model
    const { prompt } = await request.json();
    let dbFormat;
    if (prompt.content.files && prompt.content.files.length > 0)
      dbFormat = { id: prompt.id, content: { text: prompt.content.text, files: prompt.content.files }, isUser: true };
    else
      dbFormat = { id: prompt.id, content: { text: prompt.content.text }, isUser: true };
    addMessage(id, dbFormat); // Add user message to db
    const timestamp_id = Date.now().toString();
    const chatId = `assitant-${timestamp_id}`;
    const aiResponse = streamAIResponse(id, prompt);
    const metaData = { id: timestamp_id };
    let data = "";

    // Create a new ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(new TextEncoder().encode(`event: meta\ndata: ${JSON.stringify(metaData)}\n\n`));
          controller.enqueue(new TextEncoder().encode(`event: type\ndata: json-delta\n\n`));
          for await (const chunk of aiResponse) {
            let response;
            if (!chunk.streaming) break;
            if (chunk.type === "text") {
              const jsonData = { success: true, data: chunk.text };
              response = JSON.stringify(jsonData);
              data += chunk.text;
            }
            controller.enqueue(new TextEncoder().encode(`event: json-delta\ndata: ${response}\n\n`));
          }
          controller.enqueue(new TextEncoder().encode(`event: stop\ndata: [DONE]\n\n`));
          // Add assistant messages to db
          await addMessage(id, {
            id: chatId,
            content: { text: data },
            isUser: false,
          });
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache, no-transform',
      },
    })
  } else {
    return NextResponse.json({ success: false, message: "Invalid action" });
  }
}