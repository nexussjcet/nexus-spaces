import db from "@/lib/db/db";
import { posts, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Calendar, SquareGanttChart, User } from "lucide-react";

export default async function PostsPage() {
  const allPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      createdAt: posts.createdAt,
      userId: posts.userId,
      userName: users.name,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .orderBy(desc(posts.createdAt));

  const formatDate = (date: Date | null) => {
    if (!date) return "Date not available";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">All Posts</h1>
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-[800px] mx-auto">
          {allPosts.length > 0 ? (
            allPosts.map((post) => (
              <div key={post.id} className="group">
                <div className="border border-neutral-800 rounded-xl p-6 transition-all hover:bg-neutral-900">
                  <div className="flex items-center gap-2 mb-4">
                    <SquareGanttChart className="h-5 w-5 text-neutral-400" />
                    <h2 className="text-xl sm:text-2xl font-semibold group-hover:text-white transition-colors">
                      {post.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <User className="h-4 w-4" />
                    <p>Posted by: {post.userName || "Unknown User"}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-400 mt-2">
                    <Calendar className="h-4 w-4" />
                    <p>Posted on: {formatDate(post.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-400 col-span-2 text-center p-4">
              No posts found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
