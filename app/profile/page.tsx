import Image from "next/image"
import Link from "next/link"
import { auth } from "@/auth"
import { SignOutButton } from "@/components/custom/sign-out"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/models/users";
import { updateBio } from "./actions"

interface User {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    bio: string | null;
}

export default async function Profile() {
    const session = await auth();
    let user: User | undefined;

    if (!session) {
        redirect("/signin");
    } else {
        user = await getUser(session.user?.id!);
    }

    return (
        <div className="flex flex-col w-full h-screen bg-black text-white">
            <nav className="px-4 py-2 flex flex-row gap-2 items-center border-b border-dashed border-neutral-600">
                <Image src="/nexus.webp" width={60} height={60} alt="Nexus" />
                <h2 className="text-md md:text-xl font-bold">Nexus Spaces</h2>
                <div className="ml-auto flex flex-row gap-6 items-center">
                    <Link href="/">Home</Link>
                    <SignOutButton />
                </div>
            </nav>
            <div className="flex flex-col justify-center items-center w-full h-full">
                <Avatar className="w-20 h-20">
                    <AvatarImage src={user.image!}/>
                    <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2 max-w-[300px] w-full">
                    <label>Username</label>
                    <Input value={user.name!} disabled/>
                    <label>Email</label>
                    <Input value={user.email!} disabled/>
                    <form action={updateBio} className="flex flex-col gap-2">
                        <label>Bio</label>
                        <Input type="hidden" name="id" value={user.id}/>
                        <Textarea name="bio" defaultValue={user.bio ?? ""} placeholder="Tell us something about yourself" rows={4} required/>
                        <Button type="submit">Update bio</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}