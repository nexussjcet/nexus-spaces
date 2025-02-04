import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner"
import ChatContextProvider from "@/contexts/chat";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth(); // eslint-disable-line @typescript-eslint/no-unused-vars
  
  return (
    <ChatContextProvider>
      <Toaster position="top-right" richColors />
      {children}
    </ChatContextProvider>
  );
}
