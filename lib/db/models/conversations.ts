import { eq, InferInsertModel } from "drizzle-orm";
import db from "../db";
import { conversations } from "../schema";
import type { Message, Conversation } from "@/types";

export async function createConversation(conversation: InferInsertModel<typeof conversations>) {
  await db.insert(conversations).values(conversation).returning();
}

export async function deleteConversation(convId: string) {
  await db.delete(conversations).where(eq(conversations.id, convId));
}

export async function getConversation(convId: string): Promise<Conversation> {
  return (await db.select().from(conversations).where(eq(conversations.id, convId)))[0] as Conversation;
}

export async function addMessage(id: string, message: Message) {
  const existingMessages = (await getConversation(id));
  if (!existingMessages) {
    await db.update(conversations).set({
      messages: [message],
    }).where(eq(conversations.id, id));
  } else {
    await db.update(conversations).set({
      messages: existingMessages.messages.concat([message]),
    }).where(eq(conversations.id, id));
  }
}

export async function updateTitle(convId: string, title: string) {
  await db.update(conversations).set({
    title,
  }).where(eq(conversations.id, convId));
};

export async function getUserConversations(userId: string) {
  return await db.select({
    id: conversations.id,
    title: conversations.title,
    timestamp: conversations.timestamp,
    userId: conversations.userId,
  }).from(conversations).where(eq(conversations.userId, userId));
}