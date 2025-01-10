import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChatPage } from "@/components/custom/chat-page";
import { addChat, getUserChats } from "@/lib/db/models/chats";

export default async function Home() {
    const session = await auth();
    let chats;

    if(session){
        chats = await getUserChats(session.user?.id!);
        if(chats.length === 0){
            chats = await addChat(session.user?.id!);
        }
    }else{
        redirect("/signin");
    }

    return (
        <ChatPage chats={chats}/>
    );
}
