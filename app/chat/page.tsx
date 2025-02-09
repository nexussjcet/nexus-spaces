import { ChatHome } from "@/components/custom/chat-home";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function Home() {
  return (
    <div className="flex flex-col w-full bg-black text-white p-4">
      <SidebarTrigger />
      <ChatHome />
    </div>
  );
}
