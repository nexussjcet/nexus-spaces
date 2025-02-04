import { SignInButton } from "@/components/custom/sign-in";
import Image from "next/image";
import { auth } from "@/auth";
import { getUser } from "@/lib/db/models/users";
import { redirect } from "next/navigation";
import { InteractiveGridPattern } from "../../components/ui/interactive-grid-pattern";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function Signin() {
  const session = await auth();

  if (session) {
    const user = await getUser(session.user?.id!); // eslint-disable-line @typescript-eslint/no-non-null-asserted-optional-chain
    if (!user.bio) {
      redirect("/profile");
    } else {
      redirect("/");
    }
  }

  return (

    <div className="flex flex-col w-full h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none z-[10]">
        <InteractiveGridPattern
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "",
          )}
        />
      </div>
      <nav className="p-2 flex flex-row items-center border-b border-dashed border-neutral-600">
        <Link
          href="/"
          title="Home"
          className="flex flex-row items-center gap-2"
        >
          <Image src="/nexus.webp" width={70} height={70} alt="Nexus" />
          <h2 className="text-md md:text-xl font-bold">NEXUS SPACES</h2>
        </Link>
      </nav>
      <div className="flex flex-col justify-center items-center w-full h-full">
        <div className="flex flex-col gap-2 items-center border border-dashed border-neutral-600 p-6 md:p-9">
          <Image src="/nexus.webp" width={180} height={180} alt="Nexus" />
          <h1 className="text-2xl font-bold">Hey there!</h1>
          <p>Your dream team is one click away!</p>
          <SignInButton />
        </div>
      </div>
      <footer className="p-2 flex flex-row justify-center items-center border-t border-dashed border-neutral-600">
        <p className="text-md md:text-l text-neutral-400">
          © 2025{" "}
          <a href="https://github.com/nexussjcet/nexus-spaces">Nexus Spaces</a>:
          Built by students for students
        </p>
      </footer>
    </div>
  );
}
