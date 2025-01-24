"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/custom/chat-sidebar";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Send, File } from "lucide-react";
import { Input } from "@/components/ui/input";
import Markdown from "react-markdown";
import type { Message, Conversation } from "@/types";
import { fetchConversations, initConversation, sendMessage } from "@/lib/handler";
import { base64 } from "@/lib/format";

interface Props {
  user: {
    id: string;
  }
};

export function ChatPage({ user }: Props) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [conversation, setConversation] = useState<Conversation>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [updated, setUpdated] = useState(false);

  const fetchAllConversation = async () => {
    const res = await (await fetchConversations(user.id)).json();
    if (res.success) {
      setConversations(res.data);
    } else {
      throw new Error("Failed to fetch conversations");
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    handleSendMessage();
  };

  // Update messages on client
  const updateConversation = (newMessage: Message) => {
    setConversation((prev) => {
      if (prev && prev.messages) {
        const messageExists = prev.messages.some((msg) => msg.id === newMessage.id);
        if (messageExists) {
          return {
            ...prev,
            messages: prev.messages.map((msg) =>
              msg.id === newMessage.id ? { ...msg, ...newMessage } : msg
            ),
          };
        } else {
          return { ...prev, messages: [...prev.messages, newMessage] };
        }
      }
      return { ...prev!, messages: [newMessage] };
    });
  };

  // Handle send event 
  const handleSendMessage = async () => {
    const chatId = `user-${Date.now().toString()}`;
    const userMessage: Message = { id: chatId, content: { text: message, files: await base64(files) }, isUser: true };
    updateConversation(userMessage);
    const response = sendMessage(selectedConversation, chatId, message, files);
    setMessage("");
    setFiles([]);
    let responseText = "";
    for await (const chunk of response) {
      responseText += chunk.data;
      const assitantMessage: Message = { id: chunk.id, content: { text: responseText }, isUser: false };
      updateConversation(assitantMessage);
    }
    if (!updated) {
      fetchAllConversation();
      setUpdated(true);
    }
  };

  const handleNewChat = async () => {
    const res = await (await initConversation(user)).json();
    setSelectedConversation(res.data.id);
    fetchAllConversation();
    setUpdated(false);
  };

  useEffect(() => {
    fetchAllConversation();
  }, []);

  useEffect(() => {
    setConversation(conversations.find((conv) => conv.id === selectedConversation));
  }, [selectedConversation]);

  return (
    <SidebarProvider>
      <ChatSidebar
        conversations={conversations}
        setConversations={setConversations}
        selectedConversations={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        handleNewChat={handleNewChat}
      />
      <div className="flex flex-col h-screen w-full bg-black text-white p-4">
        <SidebarTrigger />
        <div className="flex flex-col-reverse gap-4 h-full p-4 items-center overflow-y-auto scroller">
          {conversation?.messages.toReversed().map((chatMessage) => (
            <div
              className="flex flex-col w-full max-w-[700px]"
              key={chatMessage.id}
            >
              <h3 className="font-bold text-neutral-400">
                {chatMessage.isUser ? "You" : "Spacey"}
              </h3>
              <Markdown>{chatMessage.content.text}</Markdown>
            </div>
          ))}
        </div>
        <div
          className="flex flex-col w-full h-fit gap-2 border p-2"
        >
          <Input
            name="prompt"
            placeholder="Ask me anything..."
            className="mt-auto border-0"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex flex-row">
            <Input
              type="file"
              className="w-[50%]"
              onChange={(e) => setFiles((prev) => [...prev, ...(e.target?.files || [])])}
              multiple
            >
            </Input>
            <Button className="w-fit ml-auto" onClick={handleSubmit}>
              <Send />
              Send
            </Button>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
