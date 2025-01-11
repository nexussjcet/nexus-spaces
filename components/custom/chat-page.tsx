"use client";
import {
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar"
import { ChatSidebar } from "@/components/custom/chat-sidebar";

import { useState } from "react";
import {useQuery} from "@tanstack/react-query";
import {useChat} from "ai/react";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input"

import Markdown from "react-markdown"

interface Props{
    chats: {
        id: string,
        name: string | null,
        userId: string | null
    }[]
}

interface Message{
    id: string,
    role: "user" | "system",
    content: string
}

export function ChatPage({chats}: Props) {
    const [selectedChat, setSelectedChat] = useState(chats[0].id)
    const {data} = useQuery({
        queryKey: ["messages"],
        queryFn: async () => {
            const response = await fetch(`/api/chat/${selectedChat}`);

            if(response.ok){
                return (await response.json()) as {messages: Message[]};
            }else{
                throw new Error(response.statusText);
            }
        }
    })



    const {messages, error, input, isLoading, handleInputChange, handleSubmit} = useChat({
        api: `/api/chat/${selectedChat}`,
        initialMessages: data?.messages
    })

    return (
        <SidebarProvider>
            <ChatSidebar chats={chats} selectedChat={selectedChat}/>
            <div className="flex flex-col h-screen w-full bg-black text-white p-4">
                <SidebarTrigger />
                <div className="flex flex-col-reverse gap-4 h-full p-4 items-center overflow-y-auto scroller">
                    {
                        messages.toReversed().map(message => (
                            <div className="flex flex-col w-full max-w-[700px]" key={message.id}>
                                <h3 className="font-bold text-neutral-400">{message.role === "user" ? "You" : "Spacey"}</h3>
                                <Markdown>{message.content}</Markdown>
                            </div>
                        ))
                    }
                </div>
                <form className="flex flex-col w-full h-fit gap-2 border p-2" onSubmit={handleSubmit}>
                    <Input name="prompt" 
                        placeholder="Ask me anything..." 
                        className="mt-auto border-0"
                        value={input}
                        onChange={handleInputChange}
                        />
                    <Button className="w-fit ml-auto" type="submit">
                        <Send/>
                        Send
                    </Button>
                </form>
            </div>
        </SidebarProvider>
    )
}