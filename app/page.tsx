import Image from "next/image"
import { auth } from "@/auth"
import { SignOutButton } from "@/components/custom/sign-out"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/models/users";
import { updateBio } from "./actions"
import { getLanguageColor } from "@/lib/github-colors"

interface User {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    bio: string | null;
    topRepositories: string | null;
}

export default async function Profile() {
    const session = await auth();

    if (!session) {
        redirect("/signin");
    }

    const user = await getUser(session.user?.id!);
    
    if (!user) {
        redirect("/signin");
    }

    const topRepos = JSON.parse(user.topRepositories || '[]');

    return (
        <div className="flex flex-col w-full min-h-screen bg-black text-white">
            <nav className="px-4 py-2 flex flex-row gap-2 items-center border-b border-dashed border-neutral-600">
                <Image src="/nexus.webp" width={60} height={60} alt="Nexus" />
                <h2 className="text-md md:text-xl font-bold">Nexus Spaces</h2>
                <div className="ml-auto">
                    <SignOutButton />
                </div>
            </nav>
            <div className="flex flex-col items-center w-full flex-1 overflow-y-auto py-8">
                <div className="flex flex-col gap-8 max-w-[600px] w-full px-4">
                    <div className="flex flex-col items-center text-center">
                        <Avatar className="w-24 h-24 mb-4">
                            <AvatarImage src={user.image || ''}/>
                            <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                        <p className="text-neutral-400">{user.bio || 'No bio yet'}</p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label>Username</label>
                                <Input value={user.name || ''} disabled/>
                            </div>
                            <div className="space-y-2">
                                <label>Email</label>
                                <Input value={user.email || ''} disabled/>
                            </div>
                        </div>
                        <form action={updateBio} className="space-y-2">
                            <label>Bio</label>
                            <Input type="hidden" name="id" value={user.id}/>
                            <Textarea 
                                name="bio" 
                                defaultValue={user.bio ?? ""} 
                                placeholder="Tell us something about yourself" 
                                rows={4} 
                                required
                            />
                            <Button type="submit">Update bio</Button>
                        </form>
                    </div>

                    {topRepos.length > 0 && (
                        <div className="flex flex-col gap-4">
                            <div className="border-t border-dashed border-neutral-600 pt-4">
                                <h3 className="text-lg font-semibold mb-4">Repositories</h3>
                                <div className="grid gap-4">
                                    {topRepos.map((repo: any) => (
                                        <a 
                                            key={repo.name} 
                                            href={repo.url}
                                            target="_blank"
                                            rel="noopener noreferrer" 
                                            className="p-4 border border-neutral-600 rounded-lg hover:bg-neutral-900 transition-colors"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <h4 className="font-medium">{repo.name}</h4>
                                                {repo.description && (
                                                    <p className="text-sm text-neutral-400">{repo.description}</p>
                                                )}
                                                <div className="flex gap-4 text-sm text-neutral-400">
                                                    <div className="flex gap-3">
                                                        {repo.languages?.map((lang: { name: string; percentage: number }) => (
                                                            <span key={lang.name} className="flex items-center">
                                                                <span 
                                                                    className="inline-block w-3 h-3 rounded-full mr-1" 
                                                                    style={{ backgroundColor: getLanguageColor(lang.name) }}
                                                                />
                                                                {lang.name} {lang.percentage}%
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <span>⭐ {repo.stars}</span>
                                                    <span>Forks: {repo.forks}</span>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
