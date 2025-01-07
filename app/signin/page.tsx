import { SignInButton } from "@/components/custom/sign-in"
import Image from "next/image"

export default function Signin(){
    return (
        <div className="flex flex-col w-full h-screen bg-black text-white">
            <nav className="p-2 flex flex-row gap-2 items-center border-b border-dashed border-neutral-600">
                <Image src="/nexus.webp" width={60} height={60} alt="Nexus"/>
                <h2 className="text-md md:text-xl font-bold">Nexus Spaces</h2>
            </nav>
            <div className="flex flex-col justify-center items-center w-full h-full">
                <div className="flex flex-col gap-2 border border-dashed border-neutral-600 p-6 md:p-9">
                    <h1 className="text-2xl font-bold">Hey there!</h1>
                    <p>Your dream team is one click away</p>
                    <SignInButton/>
                </div>
            </div>
        </div>
    )
}