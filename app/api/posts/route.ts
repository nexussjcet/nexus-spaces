import { auth } from "@/auth";
import db from "@/lib/db/db";
import { posts } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content } = await req.json();

  const newPost = await db
    .insert(posts)
    .values({
      title,
      content,
      userId: session.user.id,
    })
    .returning();

  return NextResponse.json(newPost);
}
