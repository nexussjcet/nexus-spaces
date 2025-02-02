"use client";
import { useRouter } from "next/navigation";
import { fetchAllConversation, fetchConversation, initConversation, sendMessage } from '@/lib/handler';
import { Conversation, ConversationMetadata, Message } from '@/types';
import { useState, createContext, useContext, useEffect, useRef } from 'react'
import { useSession } from "next-auth/react";
import { base64 } from "@/lib/format";

type ConversationContextProps = {
  conversationList: ConversationMetadata[];
  selectedConversation: string;
  setSelectedConversation: React.Dispatch<React.SetStateAction<string>>;
  conversation: Conversation;
  setConversation: React.Dispatch<React.SetStateAction<Conversation>>;
  updated: boolean;
  setUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  streaming: React.RefObject<boolean>;
  handleNewChat: () => Promise<void>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSendMessage: () => void;
  updateConversationList: () => Promise<void>;
  updateConversation: (newMessage: Message) => void;
}

const ConversationContext = createContext<ConversationContextProps | null>(null);

export default function ConversationContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  let user;
  if (session) {
    user = { id: session.user?.id! };
  } else {
    return (<>{children}</>);
  }

  const router = useRouter();

  const [conversationList, setConversationList] = useState<ConversationMetadata[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [conversation, setConversation] = useState<Conversation>({} as Conversation);
  const [updated, setUpdated] = useState(false);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const streaming = useRef(false);

  const updateConversationList = async () => {
    const res = await (await fetchAllConversation(user.id)).json();
    if (res.success) {
      const convList = res.data;
      convList.sort((a: ConversationMetadata, b: ConversationMetadata) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setConversationList(convList);
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

  const handleNewChat = async () => {
    const res = await (await initConversation(user)).json();
    setSelectedConversation(res.data.id);
    updateConversationList();
    setUpdated(false);
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
    let thinkingText = "";
    let isInThinkingBlock = false;
    let normalResponse = "";
    let thinkingStartTime = Date.now();

    try {
        for await (const chunk of response) {
            responseText += chunk.data;
            while (responseText.length > 0) {
                if (!isInThinkingBlock) {
                    const thinkStart = responseText.indexOf("<think>");
                    if (thinkStart === -1) {
                        normalResponse += responseText;
                        responseText = "";
                    } else {
                        normalResponse += responseText.substring(0, thinkStart);
                        responseText = responseText.substring(thinkStart + 7); 
                        isInThinkingBlock = true;
                    }
                } else {
                    const thinkEnd = responseText.indexOf("</think>");
                    if (thinkEnd === -1) {
                        thinkingText += responseText;
                        responseText = "";
                    } else {
                        thinkingText += responseText.substring(0, thinkEnd);
                        responseText = responseText.substring(thinkEnd + 8); 
                        isInThinkingBlock = false;
                    }
                }
            }
            const duration = ((Date.now() - thinkingStartTime) / 1000).toFixed(1);
            const assistantMessage: Message = {
                id: chunk.id,
                content: { text: normalResponse.trim() },
                isUser: false,
                thinking: thinkingText ? {
                    duration: `${duration}s`,
                    summary: "Processing your request...",
                    process: thinkingText.trim()
                } : undefined
            };

            updateConversation(assistantMessage);
            streaming.current = chunk.streaming;
        }
    } catch (error) {
        console.error('Error processing response:', error);
    }

    if (!updated) {
        updateConversationList();
        setUpdated(true);
    }
};
  useEffect(() => {
    updateConversationList();
  }, []);

  useEffect(() => {
    conversationList.forEach(async (conv: any) => {
      if (conv.id === selectedConversation) {
        const res = await (await fetchConversation(conv.id)).json();
        if (res.success) {
          setConversation(res.data);
        }
      }
    });
    router.push(selectedConversation);
  }, [selectedConversation]);

  return (
    <ConversationContext.Provider
      value={{
        conversationList,
        selectedConversation,
        setSelectedConversation,
        conversation,
        setConversation,
        updated,
        setUpdated,
        message,
        setMessage,
        files,
        setFiles,
        streaming,
        handleNewChat,
        handleKeyDown,
        handleSubmit,
        handleSendMessage,
        updateConversationList,
        updateConversation,
      }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversationContext() {
  const context = useContext(ConversationContext);
  if (!context) throw new Error("useConversationContext must be used within a ConversationProvider");
  return context;
}