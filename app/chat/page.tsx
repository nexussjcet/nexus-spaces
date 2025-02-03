import { auth } from "@/auth";
import { ChatSidebar } from "@/components/custom/chat-sidebar";
import { ChatHome } from "@/components/custom/chat-home";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <SidebarProvider>
        <ChatSidebar />
        <div className="flex flex-col h-screen w-full bg-black text-white p-4">
          <SidebarTrigger />
          <ChatHome />
        </div>
      </SidebarProvider>
    </>
  );
}
