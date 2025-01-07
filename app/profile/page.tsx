import Image from "next/image"
import { SignOutButton } from "@/components/custom/sign-out"

export default function Profile() {
    return (
        <div className="flex flex-col w-full h-screen bg-black text-white">
            <nav className="p-4 flex flex-row gap-2 items-center border-b border-dashed border-neutral-600">
                <Image src="/nexus.webp" width={60} height={60} alt="Nexus" />
                <h2 className="text-md md:text-xl font-bold">Nexus Spaces</h2>
                <div className="ml-auto">
                    <SignOutButton/>
                </div>
            </nav>
        </div>
    )
}