"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProfile } from "@/components/custom/sidebar-profile";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useChatContext } from "@/contexts/chat";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ChatSidebar() {
  const {
    conversationList,
    selectedConversation,
    setSelectedConversation,
    sidebarLoading,
    setSidebarLoading,
    handleNewChat,
    handleDeleteChat
  } = useChatContext();

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const loadConversations = async () => {
      setTimeout(() => {
        setSidebarLoading(false);
      }, 500);
    };
    loadConversations();
  }, [sidebarLoading]);

  useEffect(() => {
    setSelectedConversation("");
  }, [router]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Sidebar className="bg-black">
        <SidebarHeader>
          <Link
            href="/chat"
            passHref
            onClick={() => router.push("/")}
            className="w-[95%] flex flex-row items-center justify-center cursor-pointer"
            title="Home"
          >
            <Image src="/nexus.webp" width={100} height={100} alt="Nexus" />
            <h1 className="font-extrabold">NEXUS SPACES</h1>
          </Link>
          <Button
            className="my-4 mx-3 rounded-xl"
            onClick={handleNewChat}
          >
            New Chat
          </Button>
        </SidebarHeader>
        <SidebarContent>
          {sidebarLoading ? (
            <div className="flex flex-col justify-center mt-3 ml-5 gap-5">
              <Skeleton className="bg-gray-600 h-[15px] w-[80%]" />
              <Skeleton className="bg-gray-600 h-[15px] w-[80%]" />
              <Skeleton className="bg-gray-600 h-[15px] w-[75%]" />
              <Skeleton className="bg-gray-600 h-[15px] w-[70%]" />
              <Skeleton className="bg-gray-600 h-[15px] w-[65%]" />
              <Skeleton className="bg-gray-600 h-[15px] w-[75%]" />
            </div>
          ) : (
            <SidebarMenu>
              {conversationList.map((conv) => (
                <SidebarMenuItem
                  key={conv.id}
                  className="mx-4 my-1"
                  title={conv.title.text}
                >
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "p-5 cursor-pointer hover:bg-neutral-900",
                      conv.id === selectedConversation && "bg-neutral-900",
                    )}
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <span>{conv.title.text}</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild
                      className="mt-1"
                    >
                      <SidebarMenuAction>
                        <MoreHorizontal />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          toast("Not Available Yet", {
                            description: "Feature coming soon...",
                          });
                        }}
                      >
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleDeleteChat(conv.id)}
                      >
                        <span>Delete Chat</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </SidebarContent>
        <SidebarFooter>
          <SidebarProfile session={session} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}