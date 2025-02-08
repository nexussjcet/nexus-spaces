"use client";
import { useRouter } from "next/navigation";
import { Conversation, ConversationMetadata, Message } from '@/types';
import { useState, createContext, useContext, useEffect, useRef } from 'react'
import { useSession } from "next-auth/react";
import { toast } from "sonner"
import { fetchAllConversation, fetchConversation, initConversation, deleteConversation, sendMessage } from '@/lib/handler';
import { base64 } from "@/lib/format";

type ChatContextProps = {
  textareaRef: React.RefObject<HTMLInputElement | null>;
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
  handleDeleteChat: (convId: string) => Promise<void>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSendMessage: () => void;
  updateConversationList: () => Promise<void>;
  updateConversation: (newMessage: Message) => void;
}

const ChatContext = createContext<ChatContextProps | null>(null);

export default function ChatContextProvider({ children }: { children: React.ReactNode }) {
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

  const textareaRef = useRef<HTMLInputElement>(null);

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
    toast.promise(initConversation(user), {
      loading: "Starting new chat...",
      success: async (data) => {
        const res = await data.json();
        setSelectedConversation(res.data.id);
        await new Promise((resolve) => setTimeout(resolve, 700));
        updateConversationList();
        return "New chat created successfully";
      },
      error: 'Error occurred',
    });
  };

  const handleDeleteChat = async (convId: string) => {
    toast.promise(deleteConversation(convId, user.id), {
      loading: "Deleting chat...",
      success: async (data) => {
        const res = await data.json();
        if (res.success) {
          if (selectedConversation === res.data.id) {
            setSelectedConversation("");
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 700));
        updateConversationList();
        return "Chat deleted successfully";
      },
      error: 'Error occurred',
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
        if (chunk?.success) {
          responseText += chunk.data;
          const assistantMessage: Message = {
            id: chunk.id,
            content: { text: responseText },
            isUser: false
          };
          updateConversation(assistantMessage);
          streaming.current = chunk.streaming; // Set streaming status
        } else {
          toast.error("Internal server error");
          streaming.current = false;
        }
      }
    } catch (error) {
      console.error('Error processing response:', error);
    }

    if (!conversationList[0].title.updated) {
      updateConversationList();
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
    router.push(`/chat/${selectedConversation}`);
    textareaRef.current?.focus();
  }, [selectedConversation]);

  return (
    <ChatContext.Provider
      value={{
        textareaRef,
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
        handleDeleteChat,
        handleKeyDown,
        handleSubmit,
        handleSendMessage,
        updateConversationList,
        updateConversation,
      }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChatContext must be used within a ChatContextProvider");
  return context;
}