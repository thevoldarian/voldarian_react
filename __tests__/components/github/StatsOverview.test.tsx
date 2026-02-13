import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsOverview } from '../../../src/components/github/StatsOverview';
import type { GitHubUser } from '../../../src/services/githubService';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('StatsOverview', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
  const mockUserData: GitHubUser = {
    login: 'testuser',
    name: 'Test User',
    public_repos: 10,
    followers: 20,
    following: 30,
    avatar_url: 'https://example.com/avatar.jpg',
    bio: 'Test bio',
    location: 'Test location',
    created_at: '2020-01-01',
  };

  it('renders user stats', () => {
    render(<StatsOverview userData={mockUserData} totalStars={50} />);

    expect(screen.getByText('10')).toBeDefined();
    expect(screen.getByText('20')).toBeDefined();
    expect(screen.getByText('30')).toBeDefined();
    expect(screen.getByText('50')).toBeDefined();
  });
});
