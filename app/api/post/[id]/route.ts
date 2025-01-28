import db from "@/lib/db/db";
import { posts } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const action = req.nextUrl.searchParams.get("action");

  if (action === "create") {
    const body = await req.json();
    console.log("Received body:", JSON.stringify(body, null, 2));

    const { content, media, userId } = body;

    if (!content) {
      console.error("Content is missing");
      return NextResponse.json(
        { message: "Content is required." },
        { status: 400 },
      );
    }

    if (!userId) {
      console.error("UserId is missing");
      return NextResponse.json(
        { message: "UserId is required." },
        { status: 400 },
      );
    }

    try {
      await db.insert(posts).values({
        id,
        content,
        media: media || [], // Default to empty array if media is not provided
        userId,
      });

      return NextResponse.json(
        { message: "Post created successfully" },
        { status: 201 },
      );
    } catch (error) {
      console.error("Detailed Error saving post:", error);
      return NextResponse.json(
        {
          message: "Failed to create post",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { message: `Action ${action} not allowed` },
    { status: 405 },
  );
}
