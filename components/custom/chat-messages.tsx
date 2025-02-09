"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { fetchConversation } from "@/lib/handler";
import { useChatContext } from "@/contexts/chat";
import { useParams, useRouter } from "next/navigation";
import MarkdownRender from "./markdown-render";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatNew } from "./chat-new";

export function ChatMessages() {
  const convId = useParams().id;
  const router = useRouter();

  const {
    setSelectedConversation,
    conversation,
    setConversation,
    messageLoading,
    setMessageLoading,
  } = useChatContext();

  useEffect(() => {
    const loadConversation = async (id: string) => {
      const res = await (await fetchConversation(id)).json();
      if (res.success) {
        setConversation(res.data);
        setTimeout(() => {
          setMessageLoading(false);
        }, 500);
      } else {
        router.push("/chat");
      }
    };
    if (convId && typeof convId === "string") {
      loadConversation(convId);
      setSelectedConversation(convId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (conversation?.messages?.length === 0) return <ChatNew />;

  return (
    <>
      {conversation && conversation.messages?.length > 0 && messageLoading ? (
        <div className="flex flex-col-reverse h-full p-[5%] items-center overflow-y-auto scroller gap-4 md:gap-0 mb-4 md:mb-0">
          <div className="flex flex-row w-full max-w-[700px] gap-2 md:gap-4">
            <Skeleton className="bg-gray-600 w-[50px] h-[50px] rounded-full" />
            <div className="w-[80%] space-y-3">
              <Skeleton className="bg-gray-600 h-[2vh] w-[90%]" />
              <Skeleton className="bg-gray-600 h-[2vh] w-[90%]" />
              <Skeleton className="bg-gray-600 h-[2vh] w-[90%]" />
              <Skeleton className="bg-gray-600 h-[2vh] w-[80%]" />
              <Skeleton className="bg-gray-600 h-[2vh] w-[85%]" />
              <Skeleton className="bg-gray-600 h-[2vh] w-[70%]" />
            </div>
          </div>
          <div className="flex flex-row w-full max-w-[700px] gap-2 md:gap-4 mb-[5%]">
            <div className="w-[80%] space-y-3">
              <Skeleton className="bg-gray-600 h-[2vh] w-[90%] ml-[10%]" />
              <Skeleton className="bg-gray-600 h-[2vh] w-[90%] ml-[10%]" />
              <Skeleton className="bg-gray-600 h-[2vh] w-[80%] ml-[20%]" />
            </div>
            <Skeleton className="bg-gray-600 w-[50px] h-[50px] rounded-full" />
          </div>
          <div className="flex flex-row w-full max-w-[700px] gap-2 md:gap-4 mb-[5%]">
            <Skeleton className="bg-gray-600 w-[50px] h-[50px] rounded-full" />
            <div className="w-[80%] space-y-3">
              <Skeleton className="bg-gray-600 h-[2vh] w-[90%]" />
              <Skeleton className="bg-gray-600 h-[2vh] w-[80%]" />
              <Skeleton className="bg-gray-600 h-[2vh] w-[85%]" />
              <Skeleton className="bg-gray-600 h-[2vh] w-[70%]" />
            </div>
          </div>
        </div>
      ) : (
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
                  <div className={`max-w-full ${chatMessage.isUser ? 'bg-white text-black rounded-xl px-4 py-2' : ''}`}>
                    <MarkdownRender>{chatMessage.content.text}</MarkdownRender>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div >
      )}
    </>
  );
}