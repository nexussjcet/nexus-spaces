"use client"
import Image from "next/image"
import {Button} from "../ui/button"
import { redirect } from "next/navigation";
export function HomePage() {
  const handleRe = ()=> {
    redirect('/signin')
} 
 return (
    // Create Home Page
    <div className="bg-black text-neutral-300 flex flex-col items-center justify-center h-screen w-full">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <Image src="/nexus.webp" width={180} height={180} alt="Nexus" />
        <h1 className="text-4xl font-bold">Nexus Spaces</h1>
        <p className="text-lg">
          Nexus Spaces is a social media platform for developers, designers and
          other skilled individuals.
        </p>
        <p className="text-lg">
          Join the community and connect with like-minded individuals.
        </p>
        <Button className="w-36 font-semibold uppercase rounded-md mt-4 shadow-[0_5px_15px_rgba(192,192,192,0.4)] hover:shadow-[0_8px_25px_rgba(192,192,192,0.6)] transition-shadow duration-300" onClick={handleRe}>
          Join
        </Button>
      </div>
    </div>
  );
}