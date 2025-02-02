"use client"
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
export function ChatHome() {
  const { data: session } = useSession();
  const id = session?.user?.id;
  const handleIdRe = () => {
    redirect(`/${id}`)
  }
  
  return (
    <div className="flex flex-col justify-center gap-4 h-full p-4 items-center overflow-y-auto scroller">
      <div className="flex flex-col justify-center items-center gap-9">
        <h6 className="text-4xl text-center font-semibold">What can I help with?</h6>
          <Button className="rounded-lg shadow-[0_5px_15px_rgba(192,192,192,0.4)] hover:shadow-[0_8px_25px_rgba(192,192,192,0.6)] transition-shadow duration-300" onClick={handleIdRe}>
            Get Started
          </Button>
      </div>
    </div>
    // Create Home Page
  );
}