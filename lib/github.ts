interface Repository {
    name: string;
    html_url: string;
    description: string;
    stargazers_count: number;
    language: string;
}

interface LanguageStats {
    [key: string]: number;
}

export async function fetchGitHubData(accessToken: string) {
    const reposResponse = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    const repos: Repository[] = await reposResponse.json();

    const languageStats: LanguageStats = {};
    repos.forEach(repo => {
        if (repo.language) {
            languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
    });

    const topLanguages = Object.entries(languageStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([language]) => language);

    const topRepositories = repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5)
        .map(repo => ({
            name: repo.name,
            url: repo.html_url,
            description: repo.description,
            stars: repo.stargazers_count,
            language: repo.language
        }));

    return {
        topLanguages,
        topRepositories
    };
} 
