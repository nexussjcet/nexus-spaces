"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/custom/chat-sidebar";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import Markdown from "react-markdown";
import type { Message, Conversation, ConversationMetadata } from "@/types";
import { initConversation, fetchConversation, fetchAllConversation, sendMessage } from "@/lib/handler";
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
  const [conversationList, setConversationList] = useState<ConversationMetadata[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [updated, setUpdated] = useState(false);

  // Update conversation metadata on client
  const updateConversationList = async () => {
    const res = await (await fetchAllConversation(user.id)).json();
    if (res.success) {
      setConversationList(res.data);
    } else {
      throw new Error("Failed to fetch conversations");
    }
  };

  // Update conversation messages on client
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

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    handleSendMessage();
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
      updateConversationList();
      setUpdated(true);
    }
  };

  const handleNewChat = async () => {
    const res = await (await initConversation(user)).json();
    setSelectedConversation(res.data.id);
    updateConversationList();
    setUpdated(false);
  };

  useEffect(() => {
    updateConversationList();
  }, []);

  useEffect(() => {
    conversationList.forEach(async (conv) => {
      if (conv.id === selectedConversation) {
        const res = await (await fetchConversation(conv.id)).json();
        if (res.success) {
          setConversation(res.data);
        }
      }
    });
  }, [selectedConversation]);

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
              onChange={(e) => setFiles(e.target?.files ? Array.from(e.target.files) : [])}
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
