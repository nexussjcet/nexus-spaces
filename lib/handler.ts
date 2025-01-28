import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { v4 as uuid4 } from "uuid";
import { getUser } from "./db/models/users";
import { base64 } from "./format";

export const createPost = async (post: { content: any; media?: any[] }) => {
  const postId = uuid4();
  const userId = getCurrentUserId();

  const response = await fetch(`/api/post/${postId}?action=create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: post.content,
      media: post.media || [],
      timestamp: new Date().toISOString(),
      userId,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      `Failed to create post: ${errorBody.message || response.statusText}`,
    );
  }

  return response;
};

async function getCurrentUserId() {
  const session = await auth();
  let user: any;

  if (!session) {
    redirect("/signin");
  } else {
    user = await getUser(session.user?.id!);
  }
  return user.id;
}

export const initConversation = async (user: { id: string }) => {
  const convId = uuid4();
  return await fetch(`/api/chat/${convId}?action=create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      convId: convId,
      convTitle: "New Chat",
      convTimestamp: new Date().toISOString(),
      userId: user.id,
    }),
  });
};

export const fetchConversation = async (convId: string) => {
  return await fetch(`/api/chat/${convId}`);
};

export const fetchAllConversation = async (userId: string) => {
  return await fetch(`/api/user/${userId}?action=get-conversations`);
};

export async function* sendMessage(
  convId: string,
  chatId: string,
  message: string,
  files: File[],
) {
  const response = await fetch(`/api/chat/${convId}?action=ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: {
        id: chatId,
        content: {
          text: message,
          files: await base64(files),
        },
      },
    }),
  });
  // Capture the streaming response
  const reader = response?.body?.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader!.read();
    if (value) {
      const decodedChunk = decoder.decode(value);
      for await (const chunk of decodedChunk.split("{%%}")) {
        try {
          const jsonData = JSON.parse(chunk);
          yield jsonData;
        } catch (error) {
          // console.log("Error parsing chunk:", error);
        }
      }
    }
    if (done) break;
  }
}
