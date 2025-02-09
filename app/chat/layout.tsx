import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChatSidebar } from "@/components/custom/chat-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner"
import ChatContextProvider from "@/contexts/chat";

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  return (
    <ChatContextProvider>
      <Toaster position="top-right" richColors />
      <SidebarProvider>
        <ChatSidebar />
        {children}
      </SidebarProvider>
    </ChatContextProvider>
  );
}
