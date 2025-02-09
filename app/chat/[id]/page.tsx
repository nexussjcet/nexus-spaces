import { ChatMessages } from "@/components/custom/chat-messages";
import { ChatInput } from "@/components/custom/chat-input";
import { SidebarTrigger } from "@/components/ui/sidebar"

export default async function Home() {
  return (
    <div className="flex flex-col h-screen w-full bg-black text-white p-4">
      <SidebarTrigger />
      <ChatMessages />
      <ChatInput />
    </div>
  );
}
