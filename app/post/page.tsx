import Image from "next/image";
import Link from "next/link";
import PostCreator from "@/components/custom/post-creator";
import { SignOutButton } from "@/components/custom/sign-out";

export default async function Post() {
  return (
    <div className="flex flex-col w-full portrait:h-full h-screen bg-black text-white ">
      <nav className="px-4 py-2 flex flex-row gap-2 items-center border-b border-dashed border-neutral-600">
        <Image src="/nexus.webp" width={60} height={60} alt="Nexus" />
        <h2 className="text-md md:text-xl font-bold">Nexus Spaces</h2>
        <div className="ml-auto flex flex-row gap-6 items-center">
          <Link href="/">Home</Link>
          <Link href="/post">Post</Link>
          <SignOutButton />
        </div>
      </nav>
      <div className="my-auto mx-auto flex flex-col items-center justify-center">
        <PostCreator />
      </div>
    </div>
  );
}
