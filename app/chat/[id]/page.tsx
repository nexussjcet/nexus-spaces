import { ChatMessages } from "@/components/custom/chat-messages";
import { ChatInput } from "@/components/custom/chat-input";
import { ChatHeader } from "@/components/custom/chat-header";

export default async function Home() {
  return (
    <div className="flex flex-col h-screen w-full bg-black text-white">
      <ChatHeader showTitle={true} />
      <ChatMessages />
      <ChatInput />
    </div>
  );
}
