"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { fetchConversation } from "@/lib/handler";
import { useConversationContext } from "@/contexts/chat";
import { useParams } from "next/navigation";
import MarkdownRender from "./markdown-render";

export function ChatPage() {
  const convId = useParams().id;

  const {
    setSelectedConversation,
    conversation,
    setConversation,
  } = useConversationContext();

  useEffect(() => {
    const loadConversation = async (id: string) => {
      const res = await (await fetchConversation(id)).json();
      if (res.success) {
        setConversation(res.data);
      }
    };
    if (convId && typeof convId === "string") {
      loadConversation(convId);
      setSelectedConversation(convId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col-reverse gap-4 h-full p-4 items-center overflow-y-auto scroller">
      {conversation?.messages?.toReversed().map((chatMessage) => (
        <div
          className={`flex flex-col w-full max-w-[700px] ${chatMessage.isUser ? 'items-end' : ''}`}
          key={chatMessage.id}
        >
          <div className={`flex items-start gap-2 ${chatMessage.isUser ? 'flex-row-reverse' : ''}`}>
            {!chatMessage.isUser && (
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-1">
                <Image
                  src="/nexus.webp"
                  width={24}
                  height={24}
                  alt="Spacey"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className={`flex flex-col ${chatMessage.isUser ? 'items-end' : ''}`}>
              <h3 className="font-bold text-neutral-400">
                {chatMessage.isUser ? "You" : "Spacey"}
              </h3>
              <div className={`max-w-full ${chatMessage.isUser ? 'bg-blue-600 rounded-xl px-4 py-2' : ''}`}>
                <MarkdownRender>{chatMessage.content.text}</MarkdownRender>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}