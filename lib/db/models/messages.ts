import { eq, InferInsertModel } from "drizzle-orm";
import db from "../db";
import { messages } from "../schema";

export async function getMessages(chatId: string){
    return await db.select().from(messages).where(eq(messages.chatId, chatId));
}

export async function addMessage(message: InferInsertModel<typeof messages>){
    return await db.insert(messages).values(message).returning();
}

