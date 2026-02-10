import { describe, it, expect, vi, beforeEach } from 'vitest';
import { githubService } from '../../src/services/githubService';

global.fetch = vi.fn();

describe('githubService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUser', () => {
    it('fetches user data successfully', async () => {
      const mockUser = { login: 'test', name: 'Test User', public_repos: 10, followers: 5, following: 3 };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await githubService.getUser('test');
      expect(result).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/users/test');
    });

    it('throws error on failed request', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false });
      await expect(githubService.getUser('test')).rejects.toThrow('api.fetchUserFailed');
    });

    it('throws error when response has no login field', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ name: 'Test' }),
      });
      await expect(githubService.getUser('test')).rejects.toThrow('api.fetchUserFailed');
    });

    it('handles non-Error exceptions', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce('Network error');
      await expect(githubService.getUser('test')).rejects.toThrow('api.fetchUserFailed');
    });
  });

  describe('getRepositories', () => {
    it('fetches repositories successfully', async () => {
      const mockRepos = [{ id: 1, name: 'repo1', stargazers_count: 10 }];
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      const result = await githubService.getRepositories('test', 1, 10);
      expect(result).toEqual(mockRepos);
      expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/users/test/repos?sort=updated&page=1&per_page=10');
    });

    it('throws error on failed request', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false });
      await expect(githubService.getRepositories('test', 1, 10)).rejects.toThrow('api.fetchReposFailed');
    });

    it('throws error when response is not an array', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Not an array' }),
      });
      await expect(githubService.getRepositories('test', 1, 10)).rejects.toThrow('api.fetchReposFailed');
    });

    it('handles non-Error exceptions', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce('Network error');
      await expect(githubService.getRepositories('test', 1, 10)).rejects.toThrow('api.fetchReposFailed');
    });
  });

  describe('getTotalStars', () => {
    it('calculates total stars from repositories', async () => {
      const mockRepos = [
        { id: 1, name: 'repo1', stargazers_count: 10 },
        { id: 2, name: 'repo2', stargazers_count: 5 },
      ];
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      const result = await githubService.getTotalStars('test');
      expect(result).toBe(15);
    });

    it('returns 0 for empty repositories', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await githubService.getTotalStars('test');
      expect(result).toBe(0);
    });
  });
});
