import { v4 as uuid4 } from 'uuid';
import { base64 } from './format';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import type { SSEChunk } from '../types';

export const initConversation = async (user: { id: string }) => {
  const convId = uuid4();
  return await fetch(`/api/chat/${convId}?action=create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      convId: convId,
      userId: user.id,
    }),
  });
};

export const deleteConversation = async (convId: string, userId: string) => {
  return await fetch(`/api/chat/${convId}?action=delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      convId: convId,
      userId: userId,
    }),
  });
}

export const fetchConversation = async (convId: string) => {
  return await fetch(`/api/chat/${convId}`);
}

export const fetchAllConversation = async (userId: string) => {
  return await fetch(`/api/user/${userId}?action=get-conversations`);
}

export async function* sendMessage(convId: string, chatId: string, message: string, files: File[]) {
  let done = false;
  let id: string = "";
  const queue: SSEChunk[] = [];
  let resolveQueue: (() => void) | null = null;

  // Helper functions
  function pushEvent(data: SSEChunk) {
    queue.push(data);
    if (resolveQueue) {
      resolveQueue();
      resolveQueue = null;
    }
  }

  function waitForEvent(): Promise<void> {
    return new Promise((resolve) => {
      resolveQueue = resolve;
    });
  }

  // SSE connection
  fetchEventSource(`/api/chat/${convId}?action=ai`, {
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
    openWhenHidden: true,
    onmessage: (e) => {
      switch (e.event) {
        case "json-delta":
          pushEvent({ id, ...JSON.parse(e.data) });
          break;
        case "meta":
          id = `assitant-${JSON.parse(e.data).id}`;
          break;
      }
    },
    onclose: () => {
      done = true;
      if (resolveQueue) resolveQueue();
    },
  });

  // Yield data from queue
  while (!done || queue.length > 0) {
    if (queue.length === 0) {
      await waitForEvent();
    }
    while (queue.length > 0) {
      yield queue.shift();
    }
  }
};