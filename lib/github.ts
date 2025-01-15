interface Repository {
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
  forks_count: number;
  full_name: string;
}

interface LanguageStats {
  [key: string]: number;
}

async function getRepoLanguages(repoFullName: string, accessToken: string) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoFullName}/languages`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch languages for ${repoFullName}:`,
        await response.text(),
      );
      return [];
    }

    const languages = (await response.json()) as Record<string, number>;
    const total = Object.values(languages).reduce((a, b) => a + b, 0);
    return Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([lang, bytes]) => ({
        name: lang,
        percentage: Math.round((bytes / total) * 100),
      }));
  } catch (error) {
    console.error(`Error fetching languages for ${repoFullName}:`, error);
    return [];
  }
}

export async function fetchGitHubData(accessToken: string) {
  try {
    const reposResponse = await fetch(
      "https://api.github.com/user/repos?sort=stars&direction=desc&per_page=100&type=owner",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (!reposResponse.ok) {
      console.error(
        "Failed to fetch repositories:",
        await reposResponse.text(),
      );
      return { topLanguages: [], topRepositories: [] };
    }

    const repos: Repository[] = await reposResponse.json();

    // Log repos with stars
    const starredRepos = repos.filter((repo) => repo.stargazers_count > 0);

    const languageStats: LanguageStats = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languageStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([language]) => language);

    const topRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5);

    const topReposPromises = topRepos.map(async (repo) => {
      const languages = await getRepoLanguages(repo.full_name, accessToken);
      return {
        name: repo.name,
        url: repo.html_url,
        description: repo.description || "",
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        languages,
      };
    });

    const topRepositories = await Promise.all(topReposPromises);

    return {
      topLanguages,
      topRepositories,
    };
  } catch (error) {
    console.error("Error in fetchGitHubData:", error);
    throw error;
  }
}
