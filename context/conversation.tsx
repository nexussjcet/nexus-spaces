"use client";
import { redirect, useRouter } from "next/navigation";
import { fetchAllConversation, fetchConversation, initConversation } from '@/lib/handler';
import { Conversation, ConversationMetadata } from '@/types';
import { useState, createContext, useContext, useEffect } from 'react'
import { useSession } from "next-auth/react";

type ConversationContextProps = {
  conversationList: ConversationMetadata[];
  selectedConversation: string;
  setSelectedConversation: React.Dispatch<React.SetStateAction<string>>;
  conversation: Conversation;
  setConversation: React.Dispatch<React.SetStateAction<Conversation>>;
  updated: boolean;
  setUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  handleNewChat: () => Promise<void>;
  updateConversationList: () => Promise<void>;
}

const ConversationContext = createContext<ConversationContextProps | null>(null);

export default function ConversationContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  let user;
  if (session) {
    user = { id: session.user?.id! };
  } else {
    redirect("/signin");
  }
  
  const router = useRouter();

  const [conversationList, setConversationList] = useState<ConversationMetadata[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [conversation, setConversation] = useState<Conversation>({} as Conversation);
  const [updated, setUpdated] = useState(false);

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
        updateConversationList,
        handleNewChat
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