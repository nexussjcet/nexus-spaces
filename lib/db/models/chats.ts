import { eq } from "drizzle-orm";
import db from "../db";
import { chats } from "../schema";

export async function addChat(userId: string) {
  return await db
    .insert(chats)
    .values({
      userId,
    })
    .returning();
}

export async function getChats() {
  return await db.select().from(chats);
}

export async function getUserChats(userId: string) {
  return await db.select().from(chats).where(eq(chats.userId, userId));
}

export async function updateTitle(chatId: string, title: string) {
  return await db
    .update(chats)
    .set({
      name: title,
    })
    .where(eq(chats.id, chatId))
    .returning();
}
