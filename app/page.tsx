import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChatPage } from "@/components/custom/chat-page";
import { QueryProvider } from "@/components/custom/query-provider";

export default async function Home() {
  const session = await auth();
  let user;
  if (session) {
    user = { id: session.user?.id! };
  } else {
    redirect("/signin");
  }

  return (
    <QueryProvider session={session}>
      <ChatPage user={user} />
    </QueryProvider>
  );
}
