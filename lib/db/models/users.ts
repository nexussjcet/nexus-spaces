import { cosineDistance, eq, InferInsertModel, sql } from "drizzle-orm";
import db from "../db";
import { users } from "../schema";
import { generateEmbeddings } from "@/lib/embeddings";

export async function getUser(userId: string) {
  return (await db.select().from(users).where(eq(users.id, userId)))[0];
}

export async function updateUser(user: InferInsertModel<typeof users>) {
  return (
    await db.update(users).set(user).where(eq(users.id, user.id!)).returning()
  )[0];
}

export async function getSimilarUsers(search: string){
  const embeddings = await generateEmbeddings(search)
  return await db.select({
    name: users.name,
    email: users.email,
    image: users.image,
    bio: users.bio
  }).from(users).orderBy(sql<number>`1 - (${cosineDistance(users.embeddings, embeddings)})`).limit(3);
}
