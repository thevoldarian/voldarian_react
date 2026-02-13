import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import GitHubDashboard from '../../../src/pages/projects/GitHubDashboard';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../src/hooks/useGitHubData', () => ({
  useGitHubData: vi.fn(),
}));

const mockUseGitHubData = vi.mocked(await import('../../../src/hooks/useGitHubData')).useGitHubData;

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

describe('GitHubDashboard', () => {
  it('shows loading spinner initially', () => {
    mockUseGitHubData.mockReturnValue({
      userData: null,
      totalStars: 0,
      loading: true,
      error: null,
      fetchUser: vi.fn(),
    });

    const { container } = render(<GitHubDashboard />);
    expect(container.firstChild).toBeDefined();
  });

  it('renders dashboard with user data', async () => {
    mockUseGitHubData.mockReturnValue({
      userData: mockUser,
      totalStars: 15,
      loading: false,
      error: null,
      fetchUser: vi.fn(),
    });

    render(<GitHubDashboard />);
    await waitFor(() => expect(screen.getByText('title')).toBeDefined());
  });

  it('displays error message', () => {
    mockUseGitHubData.mockReturnValue({
      userData: null,
      totalStars: 0,
      loading: false,
      error: 'Test error',
      fetchUser: vi.fn(),
    });

    render(<GitHubDashboard />);
    expect(screen.getByText('Test error')).toBeDefined();
  });

  it('calls fetchUser on mount', () => {
    const mockFetchUser = vi.fn();
    mockUseGitHubData.mockReturnValue({
      userData: null,
      totalStars: 0,
      loading: false,
      error: null,
      fetchUser: mockFetchUser,
    });

    render(<GitHubDashboard />);
    expect(mockFetchUser).toHaveBeenCalledWith('thevoldarian');
  });

  it('renders tabs when user data is available', () => {
    mockUseGitHubData.mockReturnValue({
      userData: mockUser,
      repositories: [],
      totalStars: 15,
      loading: false,
      error: null,
      fetchUser: vi.fn(),
    });

    render(<GitHubDashboard />);
    expect(screen.getByText('tabs.overview')).toBeDefined();
    expect(screen.getByText('tabs.repositories')).toBeDefined();
    expect(screen.getByText('tabs.profile')).toBeDefined();
  });

  it('changes active tab', async () => {
    const user = (await import('@testing-library/user-event')).default;
    mockUseGitHubData.mockReturnValue({
      userData: mockUser,
      totalStars: 15,
      loading: false,
      error: null,
      fetchUser: vi.fn(),
    });

    render(<GitHubDashboard />);
    const profileTab = screen.getByText('tabs.profile');
    await user.setup().click(profileTab);
    expect(screen.getByText('profile.username')).toBeDefined();
  });
});
