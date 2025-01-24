import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/custom/sign-out";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/models/users";
import { updateBio } from "./actions";
import { fetchGitHubData } from "@/lib/github";
import { GitForkIcon, StarIcon, GitBranchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  let user: User | undefined;

  if (!session) {
    redirect("/signin");
  } else {
    user = await getUser(session.user?.id!);
  }

  let repositories = [];
  try {
    if (user?.topRepositories) {
      repositories = JSON.parse(user.topRepositories);
    }
  } catch (error) {
    console.error("Error parsing topRepositories:", error);
  }

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
      <div className="flex  justify-center   w-full h-full ">
        <div className="flex portrait:flex-wrap  portrait:justify-center justify-around   items-center  xl:w-[1500px] md:w-[1200px]   portrait:h-full">
          <div className="flex flex-col items-center  portrait:w-full  portrait:mb-7 portrait:mt-5 portrait:p-5 md:border border-white p-10">
            <Avatar className="w-20 h-20 mb-5">
              <AvatarImage src={user.image!} />
              <AvatarFallback>
                {user.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2  w-full">
              <label className="text-sm mt-2">Name</label>
              <Input value={user.name!} disabled />
              <label className="text-sm mt-2">Email</label>
              <Input value={user.email!} disabled />
              <form action={updateBio} className="flex flex-col gap-2">
                <label className="text-sm mt-2">Bio</label>
                <Input type="hidden" name="id" value={user.id} />
                <Textarea
                  name="bio"
                  defaultValue={user.bio ?? ""}
                  placeholder="Tell us something about yourself"
                  rows={4}
                  required
                />
              </form>
              <Button type="submit" className="mt-2">
                Update Bio
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 p-4">
            {repositories.length > 0 ? (
              repositories.map((repo: any, index: number) => (
                <div key={index} className="group block">
                  <div className="border p-4 transition-all hover:bg-accent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GitBranchIcon className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold group-hover:text-primary">
                          {repo.name}
                        </h3>
                      </div>
                      {repo.languages?.[0] && (
                        <Badge variant="secondary">
                          {repo.languages[0].name}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {repo.description || "No description available"}
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <StarIcon className="h-4 w-4" />
                        <span>{repo.stars?.toLocaleString() ?? 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <GitForkIcon className="h-4 w-4" />
                        <span>{repo.forks?.toLocaleString() ?? 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No repositories found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
