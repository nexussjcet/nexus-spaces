import { auth } from "@/auth";
import Navbar from "@/components/custom/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getUser } from "@/lib/db/models/users";
import { GitBranchIcon, GitForkIcon, StarIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { updateBio } from "./actions";

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
  let user: User;

  if (!session) {
    redirect("/signin");
  } else {
    user = await getUser(session.user?.id!); // eslint-disable-line @typescript-eslint/no-non-null-asserted-optional-chain
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
      <Navbar />
      <div className="flex justify-center w-full h-full">
        <div className="flex portrait:flex-wrap portrait:justify-center justify-around items-start xl:w-[1500px] md:w-[1200px] portrait:h-full gap-8 p-6">
          <div className="flex flex-col items-center portrait:w-full portrait:mb-7 portrait:mt-5 portrait:p-5 md:border border-neutral-800 p-10 rounded-xl">
            <Avatar className="w-20 h-20 mb-5">
              <AvatarImage src={user.image!} />
              <AvatarFallback>
                {user.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm mt-2">Name</label>
              <Input
                value={user.name!}
                disabled
                className="rounded-xl bg-neutral-900 border-neutral-800"
              />
              <label className="text-sm mt-2">Email</label>
              <Input
                value={user.email!}
                disabled
                className="rounded-xl bg-neutral-900 border-neutral-800"
              />
              <form action={updateBio} className="flex flex-col gap-2">
                <label className="text-sm mt-2">Bio</label>
                <Input type="hidden" name="id" value={user.id} />
                <Textarea
                  name="bio"
                  defaultValue={user.bio ?? ""}
                  placeholder="Tell us something about yourself"
                  rows={4}
                  required
                  className="rounded-xl bg-neutral-900 border-neutral-800 resize-none"
                />
                <Button type="submit" className="font-semibold mt-2 rounded-lg">
                  Update Bio
                </Button>
              </form>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-4 w-full max-w-[800px]">
            {repositories.length > 0 ? (
              repositories.map(
                (
                  repo: any,
                  index: number, // eslint-disable-line @typescript-eslint/no-explicit-any
                ) => (
                  <div key={index} className="group">
                    <div className="border border-neutral-800 rounded-xl p-6 transition-all hover:bg-neutral-900">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <GitBranchIcon className="h-5 w-5 text-neutral-400" />
                          <h3 className="font-semibold group-hover:text-white transition-colors">
                            {repo.name}
                          </h3>
                        </div>
                        {repo.languages?.[0] && (
                          <Badge
                            variant="secondary"
                            className="bg-neutral-800 text-neutral-200"
                          >
                            {repo.languages[0].name}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-neutral-400 line-clamp-2 min-h-[40px]">
                        {repo.description || "No description available"}
                      </p>
                      <div className="mt-4 flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-neutral-400">
                          <StarIcon className="h-4 w-4" />
                          <span>{repo.stars?.toLocaleString() ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-400">
                          <GitForkIcon className="h-4 w-4" />
                          <span>{repo.forks?.toLocaleString() ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )
            ) : (
              <p className="text-neutral-400 col-span-2 text-center p-4">
                No repositories found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
