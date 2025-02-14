"use server"

import { signIn } from "@/auth"

export async function githubSignIn() {
  await signIn("github", { redirectTo: "/profile" })
}