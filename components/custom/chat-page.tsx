"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/custom/chat-sidebar";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Send, File, Code, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Message, Conversation, ConversationMetadata } from "@/types";
import { initConversation, fetchConversation, fetchAllConversation, sendMessage } from "@/lib/handler";
import { base64 } from "@/lib/format";
import Image from "next/image";

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
  const streaming = useRef(false);

  const updateConversationList = async () => {
    const res = await (await fetchAllConversation(user.id)).json();
    if (res.success) {
      setConversationList(res.data);
    } else {
      throw new Error("Failed to fetch conversations");
    }
  };

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

  const handleSendMessage = async () => {
    if (!selectedConversation || !message.trim()) {
      return;
    }

    const chatId = `user-${Date.now().toString()}`;
    const userMessage: Message = {
      id: chatId,
      content: { text: message, files: await base64(files) },
      isUser: true
    };

    updateConversation(userMessage);
    const response = sendMessage(selectedConversation, chatId, message, files);
    setMessage("");
    setFiles([]);

    let responseText = "";
    try {
      for await (const chunk of response) {
        responseText += chunk.data;
        const assistantMessage: Message = {
          id: chunk.id,
          content: { text: responseText },
          isUser: false
        };
        updateConversation(assistantMessage);
        streaming.current = chunk.streaming; // Set streaming status
      }
    } catch (error) {
      console.error('Error processing response:', error);
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

  const CustomMarkdownRenderer = React.memo(({ children }: { children: React.ReactNode }) => {
    const markdownContent = typeof children === 'string'
      ? children
      : React.Children.map(children, child =>
        typeof child === 'string' ? child : ''
      )?.join('') || '';

    return (
      <Markdown
        components={{
          code(props) {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <div className="relative group md:w-full w-[80vw] overflow-x-auto">
                <div className="flex justify-between items-center w-[80vw] md:w-full bg-neutral-800 px-3 py-1 rounded-t-lg">
                  <span className="text-sm text-neutral-400">
                    {match[1]}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="opacity-100 text-black hover:opacity-100 transition-all duration-200"
                    style={{ opacity: 1 }}
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                      const button = e.currentTarget;
                      button.textContent = 'Copied!';
                      setTimeout(() => {
                        button.textContent = 'Copy';
                      }, 2000);
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  className="!mt-0 !rounded-t-none w-[80vw] md:w-full"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                {...rest}
                className={`${className} bg-neutral-800 p-0 rounded text-sm break-words`}
              >
                {children}
              </code>
            );
          },
          pre(props) {
            return (
              <div className="w-full overflow-x-auto">
                {props.children}
              </div>
            );
          }
        }}
        className="break-words w-full"
      >
        {markdownContent}
      </Markdown>
    );
  });

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
                    <CustomMarkdownRenderer>{chatMessage.content.text}</CustomMarkdownRenderer>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="flex flex-col w-full h-fit gap-2 border border-neutral-800 rounded-lg p-4 bg-neutral-950"
        >
          <div className="flex flex-row items-center gap-2">
            <Input
              name="prompt"
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent border border-neutral-700 rounded-xl focus:border-neutral-500 transition-colors"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              className="w-fit flex gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <label htmlFor="file-upload" className="flex items-center gap-1 cursor-pointer hover:text-neutral-300">
              <File className="h-4 w-4" />
              {files.length > 0 ? `${files.length} files selected` : 'Attach files'}
            </label>
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(e) => setFiles(e.target?.files ? Array.from(e.target.files) : [])}
              multiple
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}