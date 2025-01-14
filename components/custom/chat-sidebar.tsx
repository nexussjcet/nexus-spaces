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

interface Props {
  chats: {
    id: string;
    name: string | null;
    userId: string | null;
  }[];
  selectedChat: string;
}

export function ChatSidebar({ chats, selectedChat }: Props) {
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
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={cn(
              "px-4 py-2 cursor-pointer hover:bg-neutral-900",
              chat.id === selectedChat && "bg-neutral-900",
            )}
          >
            <h3>{chat.name}</h3>
          </div>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
