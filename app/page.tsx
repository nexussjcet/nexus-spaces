import Image from "next/image";
import {
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar"
import { ChatSidebar } from "@/components/custom/chat-sidebar";
import { SignOutButton } from "@/components/custom/sign-out";

export default function Home() {
    return (
        <SidebarProvider>
            <ChatSidebar />
            <div className="flex flex-row h-screen w-full bg-black text-white">
                <nav className="px-4 py-2 h-fit w-full flex flex-row gap-2 items-center border-b border-dashed border-neutral-600">
                    <SidebarTrigger/>
                    <Image src="/nexus.webp" width={60} height={60} alt="Nexus" />
                    <h2 className="text-md md:text-xl font-bold">Nexus Spaces</h2>
                    <div className="ml-auto">
                        <SignOutButton />
                    </div>
                </nav>
            </div>
        </SidebarProvider>
    );
}
