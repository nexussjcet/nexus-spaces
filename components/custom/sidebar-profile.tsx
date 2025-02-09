import Link from "next/link";
import { Session } from "next-auth";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SidebarProfile({ session }: { session: Session | null }) {
  const cachedSession = useMemo(() => ({
    name: session?.user?.name || "Profile",
    image: session?.user?.image || "/default.jpg",
    fallback: session?.user?.name?.charAt(0)?.toUpperCase(),
  }), [session?.user?.name, session?.user?.image]);

  return (
    <>
      <Link
        href="/profile"
        className="my-4 w-full flex flex-row items-center justify-center gap-2 font-bold text-neutral-500 hover:text-neutral-50"
      >
        <Avatar className="w-8 h-8">
          <AvatarImage src={cachedSession.image || '/default.jpg'} alt={cachedSession.name || 'nulll'} />
          <AvatarFallback>
            {cachedSession.fallback}
          </AvatarFallback>
        </Avatar>
        <h4>{cachedSession.name || 'Profile'}</h4>
      </Link>
    </>
  )
}