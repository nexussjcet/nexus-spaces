import { auth } from "@/auth";
import { signOut } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Home, PenSquare, MessageSquare, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Navbar() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const username = session.user?.name;
  const userImage = session.user?.image;

  return (
    <nav className="px-4 py-2 flex flex-row gap-2 items-center border-b border-dashed border-neutral-600">
      <Link href="/" title="Home" className="flex flex-row items-center gap-2">
        <Image src="/nexus.webp" width={70} height={70} alt="Nexus" />
        <h2 className="text-md md:text-xl font-bold">NEXUS SPACES</h2>
      </Link>

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userImage!} />
              <AvatarFallback>
                {username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black text-white border-neutral-800 w-44">
            <DropdownMenuItem
              asChild
              className="focus:bg-neutral-600 focus:text-white hover:bg-neutral-600 hover:text-white cursor-pointer text-center justify-center gap-2"
            >
              <Link href="/"><Home size={18} /> Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="focus:bg-neutral-600 focus:text-white hover:bg-neutral-600 hover:text-white cursor-pointer text-center justify-center gap-2"
            >
              <Link href="/post"><PenSquare size={18} /> Post</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="focus:bg-neutral-600 focus:text-white hover:bg-neutral-600 hover:text-white cursor-pointer text-center justify-center gap-2"
            >
              <Link href="/posts"><MessageSquare size={18} /> Posts</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-neutral-800" />

            <DropdownMenuItem className="cursor-pointer justify-center">
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
                className="w-full text-center"
              >
                <button className="flex items-center justify-center gap-2 w-full">
                  <LogOut size={18} /> Sign Out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
