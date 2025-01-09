import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/custom/sign-in";
import { getUser } from "@/lib/db/models/users";

export default async function Home() {
    const session = await auth();

    if (session?.user) {
        const user = await getUser(session.user.id!);
        if (!user.bio) {
            redirect("/profile");
        }
    } else {
        return (
            <div className="flex flex-col w-full h-screen bg-black text-white">
                <nav className="p-2 flex flex-row gap-2 items-center border-b border-dashed border-neutral-600">
                    <Image src="/nexus.webp" width={60} height={60} alt="Nexus"/>
                    <h2 className="text-md md:text-xl font-bold">Nexus Spaces</h2>
                </nav>
                <div className="flex flex-col justify-center items-center w-full h-full">
                    <div className="flex flex-col gap-2 items-center border border-dashed border-neutral-600 p-6 md:p-9">
                        <Image src="/nexus.webp" width={180} height={180} alt="Nexus"/>
                        <h1 className="text-2xl font-bold">Welcome to Nexus Spaces</h1>
                        <p>Your dream team is one click away!</p>
                        <SignInButton/>
                    </div>
                </div>
                <footer className="p-2 flex flex-row justify-center items-center border-t border-dashed border-neutral-600">
                    <p className="text-md md:text-l text-neutral-400">© 2025 <a href="https://github.com/nexussjcet/nexus-spaces">Nexus Spaces</a>: Built by students for students</p>
                </footer>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-screen bg-black text-white">
            <nav className="p-2 flex flex-row gap-2 items-center border-b border-dashed border-neutral-600">
                <Image src="/nexus.webp" width={60} height={60} alt="Nexus"/>
                <h2 className="text-md md:text-xl font-bold">Nexus Spaces</h2>
            </nav>
            <div className="flex flex-col justify-center items-center w-full h-full">
                <h1>Welcome back!</h1>
            </div>
        </div>
    );
}
