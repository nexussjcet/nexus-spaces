import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "./lib/db/db";
import { handleGitHubSignIn } from "./lib/auth/github-handler";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account }) {
      await handleGitHubSignIn(user, account);
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
