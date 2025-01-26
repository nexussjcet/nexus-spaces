"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { PenBoxIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types";

interface Props {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  selectedConversations: string;
  setSelectedConversation: React.Dispatch<React.SetStateAction<string>>;
  handleNewChat: () => Promise<void>;
}

export function ChatSidebar({ conversations, selectedConversations, setSelectedConversation, handleNewChat }: Props) {

  return (
    <Sidebar className="bg-black">
      <SidebarHeader>
        <Image src="/nexus.webp" width={60} height={60} alt="Nexus" />
        <Link
          href="/profile"
          className="pl-2 font-bold text-neutral-500 hover:text-neutral-50"
        >
          Profile
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {conversations.map((conv) => (
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
        <Button
          className="mb-3 rounded-xl"
          onClick={handleNewChat}
        >
          New Chat
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
