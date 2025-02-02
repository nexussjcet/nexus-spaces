import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChatSidebar } from "@/components/custom/chat-sidebar";
import { ChatHome } from "@/components/custom/chat-home";
import { ChatInput } from "@/components/custom/chat-input";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  return (
    <SidebarProvider>
      <ChatSidebar />
      <div className="flex flex-col h-screen w-full bg-black text-white p-4">
        <SidebarTrigger />
        <ChatHome />
        <ChatInput />
      </div>
    </SidebarProvider>
  );
}
