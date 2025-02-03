import { fetchGitHubData } from "../github";
import { updateUser } from "../db/models/users";

export async function handleGitHubSignIn(user: any, account: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (account?.provider === "github" && account?.access_token) {
    try {
      const githubData = await fetchGitHubData(account.access_token);

      await updateUser({
        id: user.id,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        githubUsername: user.email?.split("@")[0] || null,
        topLanguages: JSON.stringify(githubData.topLanguages),
        topRepositories: JSON.stringify(githubData.topRepositories),
      });
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    }
  }
}
