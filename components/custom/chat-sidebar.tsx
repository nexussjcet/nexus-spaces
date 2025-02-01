"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ConversationMetadata } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  image?: string;
  name?: string;
}

interface Props {
  conversationList: ConversationMetadata[];
  selectedConversations: string;
  setSelectedConversation: React.Dispatch<React.SetStateAction<string>>;
  handleNewChat: () => Promise<void>;
}

export function ChatSidebar({ conversationList, selectedConversations, setSelectedConversation, handleNewChat }: Props) {
  const { data: session } = useSession();
  return (
    <Sidebar className="bg-black">
      <SidebarHeader>
        <Link href="/" className="w-[95%] flex flex-row items-center justify-center cursor-pointer">
          <Image src="/nexus.webp" width={100} height={100} alt="Nexus" />
          <h1 className="font-extrabold">NEXUS SPACES</h1>
        </Link>
        <Button
          className="my-4 mx-3 rounded-xl"
          onClick={handleNewChat}
        >
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        {conversationList.map((conv) => (
          <div
            key={conv.id}
            className={cn(
              "px-4 py-2 cursor-pointer hover:bg-neutral-900",
              conv.id === selectedConversations && "bg-neutral-900",
            )}
            onClick={() => setSelectedConversation(conv.id)}
          >
            <h3>{conv.title}</h3>
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Link
          href="/profile"
          className="my-4 w-full flex flex-row items-center justify-center gap-2 font-bold text-neutral-500 hover:text-neutral-50"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={session?.user?.image || '/default.jpg'} alt={session?.user?.name || 'nulll'} />
            <AvatarFallback>
              {session?.user?.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h4>{session?.user?.name || 'Profile'}</h4>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
