const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubUser {
  login: string;
  name: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  html_url: string;
}

export const githubService = {
  async getUser(username: string): Promise<GitHubUser> {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`);
      if (!response.ok) {
        throw new Error('api.fetchUserFailed');
      }
      const data = await response.json();
      if (!data?.login) {
        throw new Error('api.fetchUserFailed');
      }
      return data;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('api.')) {
        throw error;
      }
      throw new Error('api.fetchUserFailed');
    }
  },

  async getRepositories(username: string, page: number = 1, perPage: number = 10): Promise<GitHubRepo[]> {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?sort=updated&page=${page}&per_page=${perPage}`,
      );
      if (!response.ok) {
        throw new Error('api.fetchReposFailed');
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('api.fetchReposFailed');
      }
      return data;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('api.')) {
        throw error;
      }
      throw new Error('api.fetchReposFailed');
    }
  },

  async getTotalStars(username: string): Promise<number> {
    // Note: This fetches only the first 100 repos for performance.
    // For users with 1000+ repos, this will be an approximation.
    // Consider using GitHub GraphQL API for accurate counts across all repos.
    const repos = await this.getRepositories(username, 1, 100);
    return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
  },
};
