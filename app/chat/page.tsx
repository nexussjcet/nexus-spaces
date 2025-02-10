import { ChatHome } from "@/components/custom/chat-home";
import { ChatHeader } from "@/components/custom/chat-header";

export default async function Home() {
  return (
    <div className="flex flex-col w-full bg-black text-white">
      <ChatHeader showTitle={false} />
      <ChatHome />
    </div>
  );
}
