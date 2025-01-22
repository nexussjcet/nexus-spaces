export interface Message {
  id: string;
  content: ({ type: "text", text: string } | { type: "image", image: string})[];
  isUser?: boolean;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
  userId: string;
}