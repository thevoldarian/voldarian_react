import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRepositoryPagination } from '../../src/hooks/useRepositoryPagination';
import * as githubService from '../../src/services/githubService';
import { apiCache } from '../../src/utils/cache';

vi.mock('../../src/services/githubService', () => ({
  githubService: {
    getRepositories: vi.fn(),
  },
}));

describe('useRepositoryPagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiCache.clear();
  });

  const mockRepos = [
    { id: 1, name: 'repo1', stargazers_count: 10, forks_count: 2, description: 'Test', language: 'JS', html_url: 'url', updated_at: '2024-01-01' },
    { id: 2, name: 'repo2', stargazers_count: 5, forks_count: 1, description: 'Test2', language: 'TS', html_url: 'url2', updated_at: '2024-01-02' },
  ];

  it('initializes with default state', () => {
    const { result } = renderHook(() => useRepositoryPagination('test'));
    expect(result.current.repositories).toEqual([]);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasMore).toBe(true);
  });

  it('fetches repositories for page 1', async () => {
    vi.mocked(githubService.githubService.getRepositories).mockResolvedValue(mockRepos);

    const { result } = renderHook(() => useRepositoryPagination('test'));

    await act(async () => {
      await result.current.fetchPage(1);
    });

    expect(result.current.repositories).toEqual(mockRepos);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.hasMore).toBe(false);
    expect(githubService.githubService.getRepositories).toHaveBeenCalledWith('test', 1, 10);
  });

  it('sets hasMore to true when 10 repos returned', async () => {
    const tenRepos = Array.from({ length: 10 }, (_, i) => ({ ...mockRepos[0], id: i }));
    vi.mocked(githubService.githubService.getRepositories).mockResolvedValue(tenRepos);

    const { result } = renderHook(() => useRepositoryPagination('test'));

    await act(async () => {
      await result.current.fetchPage(1);
    });

    expect(result.current.hasMore).toBe(true);
  });

  it('handles fetch error', async () => {
    vi.mocked(githubService.githubService.getRepositories).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useRepositoryPagination('test'));

    await act(async () => {
      await result.current.fetchPage(1);
    });

    expect(result.current.error).toBe('API Error');
    expect(result.current.repositories).toEqual([]);
  });

  it('handles non-Error exceptions', async () => {
    vi.mocked(githubService.githubService.getRepositories).mockRejectedValue('String error');

    const { result } = renderHook(() => useRepositoryPagination('test'));

    await act(async () => {
      await result.current.fetchPage(1);
    });

    expect(result.current.error).toBe('api.fetchReposFailed');
  });

  it('does not fetch when username is null', async () => {
    const { result } = renderHook(() => useRepositoryPagination(null));

    await act(async () => {
      await result.current.fetchPage(1);
    });

    expect(githubService.githubService.getRepositories).not.toHaveBeenCalled();
  });

  it('fetches different pages', async () => {
    vi.mocked(githubService.githubService.getRepositories).mockResolvedValue(mockRepos);

    const { result } = renderHook(() => useRepositoryPagination('test'));

    await act(async () => {
      await result.current.fetchPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(githubService.githubService.getRepositories).toHaveBeenCalledWith('test', 2, 10);
  });

  it('uses cached data when available', async () => {
    vi.mocked(githubService.githubService.getRepositories).mockResolvedValue(mockRepos);

    const { result } = renderHook(() => useRepositoryPagination('test'));

    await act(async () => {
      await result.current.fetchPage(1);
    });

    expect(githubService.githubService.getRepositories).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.fetchPage(1);
    });

    expect(githubService.githubService.getRepositories).toHaveBeenCalledTimes(1);
  });
});
