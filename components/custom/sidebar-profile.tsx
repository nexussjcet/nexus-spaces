"use client";
import Link from "next/link";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SidebarProfile({ session }: { session: Session | null }) {
  return (
    <Link
      href="/profile"
      className="my-4 w-full flex flex-row items-center justify-start ml-3 gap-2 font-bold text-neutral-500 hover:text-neutral-50"
    >
      <Avatar className="w-8 h-8">
        <AvatarImage src={session?.user?.image || '/default.jpg'} alt={session?.user?.name || 'nulll'} />
        <AvatarFallback>
          {session?.user?.name?.charAt(0)?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <h4>{session?.user?.name || 'Profile'}</h4>
    </Link>
  )
}