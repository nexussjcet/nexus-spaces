"use client";
import { redirect } from "next/navigation";
import { ChatPage } from "@/components/custom/chat-page";
import { ChatSidebar } from "@/components/custom/chat-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useConversationContext } from "@/context/conversation";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  let user;
  if (session) {
    user = { id: session.data?.user?.id! };
  } else {
    redirect("/signin");
  }
  const {
    conversationList,
    selectedConversation,
    setSelectedConversation,
    conversation,
    setConversation,
    updated,
    setUpdated,
    updateConversationList,
    handleNewChat
  } = useConversationContext();

  return (
    <SidebarProvider>
      <ChatSidebar
        conversationList={conversationList}
        selectedConversations={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        handleNewChat={handleNewChat}
      />
      <div className="flex flex-col h-screen w-full bg-black text-white p-4">
        <SidebarTrigger />
        <ChatPage />
      </div>
    </SidebarProvider>
  );
}
