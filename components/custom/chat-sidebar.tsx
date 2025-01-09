"use client"

import {
    Sidebar,
    SidebarHeader
} from "@/components/ui/sidebar";
import { PenBoxIcon } from "lucide-react";
import { Button } from "../ui/button";

export function ChatSidebar(){
    return (
        <Sidebar className="bg-black">
            <SidebarHeader>
                <div>
                    <Button variant="ghost">
                        <PenBoxIcon/>
                    </Button>
                </div>
            </SidebarHeader>
        </Sidebar>
    )
}