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
  const response = await fetch(
    `https://api.github.com/repos/${repoFullName}/languages`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
  );
  const languages = (await response.json()) as Record<string, number>;
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  return Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([lang, bytes]) => ({
      name: lang,
      percentage: Math.round((bytes / total) * 100),
    }));
}

export async function fetchGitHubData(accessToken: string) {
  const reposResponse = await fetch(
    "https://api.github.com/user/repos?sort=updated&per_page=100",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
  );
  const repos: Repository[] = await reposResponse.json();

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

  const topReposPromises = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map(async (repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      languages: await getRepoLanguages(repo.full_name, accessToken),
    }));

  const topRepositories = await Promise.all(topReposPromises);

  return {
    topLanguages,
    topRepositories,
  };
}
