import { auth } from "@/auth";
import ChatContextProvider from "@/contexts/chat";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  return (
    <ChatContextProvider>
      {children}
    </ChatContextProvider>
  );
}
