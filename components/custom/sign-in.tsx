import { signIn } from "@/auth";
import { Button } from "../ui/button";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/profile" });
      }}
    >
      <Button type="submit" className="rounded-xl">
        Sign in with GitHub
      </Button>
    </form>
  );
}
