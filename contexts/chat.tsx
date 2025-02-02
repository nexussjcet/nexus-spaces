"use client";
import { useRouter } from "next/navigation";
import { fetchAllConversation, fetchConversation, initConversation, sendMessage } from '@/lib/handler';
import { Conversation, ConversationMetadata, Message } from '@/types';
import { useState, createContext, useContext, useEffect, useRef,useCallback } from 'react';
import { useSession } from "next-auth/react";
import { base64 } from "@/lib/format";

type ConversationContextProps = {
  conversationList: ConversationMetadata[];
  selectedConversation: string;
  setSelectedConversation: React.Dispatch<React.SetStateAction<string>>;
  conversation: Conversation;
  setConversation: React.Dispatch<React.SetStateAction<Conversation>>;
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

const processMessageContent = (text: string) => {
  let responseText = text;
  let thinkingText = "";
  let normalResponse = "";
  let isInThinkingBlock = false;

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

  return {
    normalResponse: normalResponse.trim(),
    thinkingText: thinkingText.trim()
  };
};

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
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const streaming = useRef(false);

  const updateConversationList = async () => {
    try {
      const res = await (await fetchAllConversation(user.id)).json();
      if (res.success) {
        const convList = res.data;
        convList.sort((a: ConversationMetadata, b: ConversationMetadata) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setConversationList(convList);
      } else {
        throw new Error("Failed to fetch conversations");
      }
    } catch (error) {
      console.error('Error updating conversation list:', error);
    }
  };

  const updateConversation = useCallback((newMessage: Message) => {
    setConversation((prev) => {
      if (!prev || !prev.messages) {
        return { messages: [newMessage] } as Conversation;
      }

      const messageExists = prev.messages.some((msg) => msg.id === newMessage.id);
      if (messageExists) {
        return {
          ...prev,
          messages: prev.messages.map((msg) =>
            msg.id === newMessage.id ? { ...msg, ...newMessage } : msg
          ),
        };
      }
      
      return {
        ...prev,
        messages: [...prev.messages, newMessage],
      };
    });
  }, []);

  const forceUpdate = useCallback(() => {
    setConversation(prev => ({ ...prev }));
  }, []);

  const handleNewChat = async () => {
    const res = await (await initConversation(user)).json();
    setSelectedConversation(res.data.id);
    updateConversationList();
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
    forceUpdate();

    const response = sendMessage(selectedConversation, chatId, message, files);
    setMessage("");
    setFiles([]);

    let accumulatedResponse = "";
    let thinkingStartTime = Date.now();

    try {
      for await (const chunk of response) {
        accumulatedResponse += chunk.data;
        const processed = processMessageContent(accumulatedResponse);
        
        const assistantMessage: Message = {
          id: chunk.id,
          content: { text: processed.normalResponse },
          isUser: false,
          thinking: processed.thinkingText ? {
            duration: `${((Date.now() - thinkingStartTime) / 1000).toFixed(1)}s`,
            process: processed.thinkingText
          } : undefined
        };

        updateConversation(assistantMessage);
        forceUpdate(); 
        streaming.current = chunk.streaming;
      }
    } catch (error) {
      console.error('Error processing response:', error);
    } finally {
      streaming.current = false;
      if (!conversationList[0].title.updated) {
      await updateConversationList();
      }
    }
    };


  useEffect(() => {
    const loadConversation = async () => {
      if (!selectedConversation) return;
      let ranTime =  Math.floor(Math.random()*(9-1)+1);
      try {
        const res = await (await fetchConversation(selectedConversation)).json();
        if (res.success) {
          const processedMessages = res.data.messages.map((msg: Message) => {
            if (!msg.isUser && msg.content.text) {
              const processed = processMessageContent(msg.content.text);
              return {
                ...msg,
                content: { text: processed.normalResponse },
                thinking: processed.thinkingText ? {
                  duration: `${ranTime}s`,
                  process: processed.thinkingText
                } : undefined
              };
            }
            return msg;
          });

          setConversation({
            ...res.data,
            messages: processedMessages
          });
          
          forceUpdate();
        }
      } catch (error) {
        console.error('Error loading conversation:', error);
      }
    };

    loadConversation();
  }, [selectedConversation]);

  useEffect(() => {
    updateConversationList();
  }, []);

  return (
    <ConversationContext.Provider
      value={{
        conversationList,
        selectedConversation,
        setSelectedConversation,
        conversation,
        setConversation,
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