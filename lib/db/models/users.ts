import { eq, InferInsertModel } from "drizzle-orm";
import db from "../db";
import { users } from "../schema";

export async function getUser(userId: string){
    return (await db.select().from(users).where(eq(users.id, userId)))[0];
}

export async function updateUser(user: InferInsertModel<typeof users>){
    return (await db.update(users).set(user).where(eq(users.id, user.id!)).returning())[0];
}