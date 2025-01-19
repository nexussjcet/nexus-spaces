export interface Message {
  id: string;
  content: { text?: string, files?: File[] };
  isUser: boolean;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
  userId: string;
}