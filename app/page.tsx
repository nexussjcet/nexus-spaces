import { auth } from "@/auth";
import { ChatSidebar } from "@/components/custom/chat-sidebar";
import { ChatHome } from "@/components/custom/chat-home";
import { ChatInput } from "@/components/custom/chat-input";
import { HomePage } from "@/components/custom/home-page";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function Home() {
  const session = await auth();

  return (
    <>
      {session ? (
        <SidebarProvider>
          <ChatSidebar />
          <div className="flex flex-col h-screen w-full bg-black text-white p-4">
            <SidebarTrigger />
            <ChatHome />
            <ChatInput />
          </div>
        </SidebarProvider>
      ) : (
        <HomePage />
      )}
    </>
  );
}
