import { describe, it, expect, vi } from 'vitest';
import { render } from './utils/test-utils';
import App from '../src/App';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}));

vi.mock('../src/hooks/useGitHubData', () => ({
  useGitHubData: () => ({
    userData: null,
    totalStars: 0,
    loading: false,
    error: null,
    fetchUser: vi.fn(),
  }),
}));

vi.mock('../src/hooks/useRepositoryPagination', () => ({
  useRepositoryPagination: () => ({
    repositories: [],
    currentPage: 1,
    loading: false,
    error: null,
    hasMore: false,
    fetchPage: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
  });
});
