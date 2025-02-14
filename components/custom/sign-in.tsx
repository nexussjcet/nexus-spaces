"use client"

import { githubSignIn } from "./actions"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export function SignInButton() {
  return (
    <form action={githubSignIn}>
      <Button
        type="submit"
        size="lg"
        className="gap-2 bg-white text-black hover:bg-gray-200"
      >
        <Github size={20} />
        <p className="font-semibold">Login with GitHub</p>
      </Button>
    </form>
  )
}
