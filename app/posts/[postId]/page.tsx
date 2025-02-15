import Navbar from "@/components/custom/navbar";
import db from "@/lib/db/db";
import { posts, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      createdAt: posts.createdAt,
      userId: posts.userId,
      userName: users.name,
      userImage: users.image,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.id, postId))
    .then((res) => res[0]);

  if (!post) {
    return notFound();
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Date not available";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 mb-8">
            {post.userImage && (
              <img
                src={post.userImage}
                alt={post.userName || "User"}
                className="h-10 w-10 rounded-full"
              />
            )}
            <div className="text-sm text-neutral-400">
              <p className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Posted by: {post.userName || "Unknown User"}
              </p>
              <p className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                Posted on: {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <div
            className="prose prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </div>
  );
}
