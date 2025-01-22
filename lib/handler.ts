import { v4 as uuid4 } from 'uuid';

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

// export const fetchConversation = async (convId: string) => {
//   return await fetch(`/api/chat/${convId}`);
// }

export const fetchConversations = async (userId: string) => {
  return await fetch(`/api/user/${userId}?action=get-conversations`);
}

export async function* sendMessage(convId: string, chatId: string, message: string, files: File[]) {
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
          files: files,
        },
      },
    }),
  });
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
      };
    }
    if (done) break;
  }
};