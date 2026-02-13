import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Profile } from '../../../src/components/github/Profile';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Profile', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
  const mockUser = {
    login: 'testuser',
    name: 'Test User',
    bio: 'Test bio',
    location: 'Test Location',
    created_at: '2020-01-01T00:00:00Z',
    public_repos: 10,
    followers: 5,
    following: 3,
    avatar_url: 'https://example.com/avatar.jpg',
  };

  it('renders user profile information', () => {
    render(<Profile userData={mockUser} />);
    
    expect(screen.getByText('testuser')).toBeDefined();
    expect(screen.getByText('Test User')).toBeDefined();
    expect(screen.getByText('Test bio')).toBeDefined();
    expect(screen.getByText('Test Location')).toBeDefined();
  });

  it('displays dash for missing optional fields', () => {
    const userWithoutOptionals = {
      ...mockUser,
      name: null,
      bio: null,
      location: null,
    };

    render(<Profile userData={userWithoutOptionals} />);
    
    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThanOrEqual(3);
  });

  it('formats created_at date', () => {
    render(<Profile userData={mockUser} />);
    
    const formattedDate = new Date('2020-01-01T00:00:00Z').toLocaleDateString();
    expect(screen.getByText(formattedDate)).toBeDefined();
  });
});
