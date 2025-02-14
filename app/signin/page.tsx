import { auth } from "@/auth"
import { getUser } from "@/lib/db/models/users"
import { redirect } from "next/navigation"
import SignInClient from "./signin"

export default async function SignIn() {
  const session = await auth()
  
  if (session) {
    const user = await getUser(session.user?.id!) // eslint-disable-line @typescript-eslint/no-non-null-asserted-optional-chain
    if (!user.bio) {
      redirect("/profile")
    } else {
      redirect("/")
    }
  }
  
  return <SignInClient />
}
