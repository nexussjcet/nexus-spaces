export interface Message { // Message format stored in the database
  id: string;
  content: { text?: string, files?: string[] };
  isUser?: boolean;
  isError?: boolean;
}

export interface Conversation { // Conversation format stored in the database
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
  userId: string;
}

export interface Prompt { 
  id: string;
  content: { text: string, files: File[] };
  isUser: boolean;
}