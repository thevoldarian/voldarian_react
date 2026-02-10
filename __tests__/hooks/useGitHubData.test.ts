import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGitHubData } from '../../src/hooks/useGitHubData';
import * as githubService from '../../src/services/githubService';
import { apiCache } from '../../src/utils/cache';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../src/services/githubService', () => ({
  githubService: {
    getUser: vi.fn(),
    getTotalStars: vi.fn(),
  },
}));

describe('useGitHubData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiCache.clear();
  });

  const mockUser = {
    login: 'test',
    name: 'Test',
    public_repos: 10,
    followers: 5,
    following: 3,
    avatar_url: 'https://example.com/avatar.jpg',
    bio: 'Test bio',
    location: 'Test location',
    created_at: '2020-01-01T00:00:00Z',
  };

  it('initializes with default state', () => {
    const { result } = renderHook(() => useGitHubData());
    expect(result.current.userData).toBeNull();
    expect(result.current.totalStars).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetches user data successfully', async () => {
    vi.mocked(githubService.githubService.getUser).mockResolvedValue(mockUser);
    vi.mocked(githubService.githubService.getTotalStars).mockResolvedValue(15);

    const { result } = renderHook(() => useGitHubData());
    
    await act(async () => {
      await result.current.fetchUser('test');
    });

    expect(result.current.userData).toEqual(mockUser);
    expect(result.current.totalStars).toBe(15);
    expect(result.current.error).toBeNull();
  });

  it('handles validation error', async () => {
    const { result } = renderHook(() => useGitHubData());
    
    await act(async () => {
      await result.current.fetchUser('');
    });

    expect(result.current.error).toBe('validation.usernameRequired');
  });

  it('handles fetch error', async () => {
    vi.mocked(githubService.githubService.getUser).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useGitHubData());
    
    await act(async () => {
      await result.current.fetchUser('test');
    });

    expect(result.current.error).toBe('API Error');
    expect(result.current.userData).toBeNull();
  });

  it('sanitizes username before validation', async () => {
    vi.mocked(githubService.githubService.getUser).mockResolvedValue(mockUser);
    vi.mocked(githubService.githubService.getTotalStars).mockResolvedValue(0);

    const { result } = renderHook(() => useGitHubData());
    
    await act(async () => {
      await result.current.fetchUser('  TEST  ');
    });

    expect(githubService.githubService.getUser).toHaveBeenCalledWith('test');
  });

  it('uses cached data on subsequent calls', async () => {
    vi.mocked(githubService.githubService.getUser).mockResolvedValue(mockUser);
    vi.mocked(githubService.githubService.getTotalStars).mockResolvedValue(15);

    const { result } = renderHook(() => useGitHubData());

    await act(async () => {
      await result.current.fetchUser('test');
    });

    expect(githubService.githubService.getUser).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.fetchUser('test');
    });

    expect(githubService.githubService.getUser).toHaveBeenCalledTimes(1);
  });

  it('handles non-Error exceptions', async () => {
    vi.mocked(githubService.githubService.getUser).mockRejectedValue('String error');

    const { result } = renderHook(() => useGitHubData());
    
    await act(async () => {
      await result.current.fetchUser('test');
    });

    expect(result.current.error).toBe('api.fetchDataFailed');
  });
});
