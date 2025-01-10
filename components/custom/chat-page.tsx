"use client";
import Image from "next/image";
import {
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar"
import { ChatSidebar } from "@/components/custom/chat-sidebar";
import { SignOutButton } from "@/components/custom/sign-out";
import { Textarea } from "../ui/textarea";

import { useState } from "react";

interface Props{
    chats: {
        id: string,
        name: string | null,
        userId: string | null
    }[]
}

export function ChatPage({chats}: Props) {
    const [selectedChat, setSelectedChat] = useState(chats[0].id)

    return (
        <SidebarProvider>
            <ChatSidebar chats={chats} selectedChat={selectedChat}/>
            <div className="flex flex-col h-screen w-full bg-black text-white p-4">
                <SidebarTrigger />
                <div className="flex flex-col w-full h-full">
                    <Textarea placeholder="Ask me anything..." className="mt-auto" rows={3}/>
                </div>
            </div>
        </SidebarProvider>
    )
}