import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Repositories } from '../../../src/components/github/Repositories';
import * as useRepositoryPagination from '../../../src/hooks/useRepositoryPagination';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../src/hooks/useRepositoryPagination');

describe('Repositories', () => {
  const mockRepos = [
    { id: 1, name: 'repo1', description: 'Test repo', language: 'TypeScript', stargazers_count: 10, forks_count: 2, html_url: 'https://github.com/test/repo1', updated_at: '2024-01-01' },
    { id: 2, name: 'repo2', description: null, language: null, stargazers_count: 5, forks_count: 1, html_url: 'https://github.com/test/repo2', updated_at: '2024-01-02' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner initially', () => {
    vi.mocked(useRepositoryPagination.useRepositoryPagination).mockReturnValue({
      repositories: [],
      currentPage: 1,
      loading: true,
      error: null,
      hasMore: true,
      fetchPage: vi.fn(),
    });

    const { container } = render(<Repositories username="test" />);
    expect(container.querySelector('.awsui_root_1612d_3fnrp_183')).toBeTruthy();
  });

  it('renders repositories table', async () => {
    const mockFetchPage = vi.fn();
    vi.mocked(useRepositoryPagination.useRepositoryPagination).mockReturnValue({
      repositories: mockRepos,
      currentPage: 1,
      loading: false,
      error: null,
      hasMore: false,
      fetchPage: mockFetchPage,
    });

    render(<Repositories username="test" />);
    
    await waitFor(() => {
      expect(screen.getByText('repo1')).toBeDefined();
      expect(screen.getByText('repo2')).toBeDefined();
    });
  });

  it('calls fetchPage on mount', () => {
    const mockFetchPage = vi.fn();
    vi.mocked(useRepositoryPagination.useRepositoryPagination).mockReturnValue({
      repositories: [],
      currentPage: 1,
      loading: false,
      error: null,
      hasMore: true,
      fetchPage: mockFetchPage,
    });

    render(<Repositories username="test" />);
    expect(mockFetchPage).toHaveBeenCalledWith(1);
  });

  it('displays error message', () => {
    vi.mocked(useRepositoryPagination.useRepositoryPagination).mockReturnValue({
      repositories: [],
      currentPage: 1,
      loading: false,
      error: 'Test error',
      hasMore: false,
      fetchPage: vi.fn(),
    });

    render(<Repositories username="test" />);
    expect(screen.getByText('Test error')).toBeDefined();
  });

  it('displays empty state when no repos', () => {
    vi.mocked(useRepositoryPagination.useRepositoryPagination).mockReturnValue({
      repositories: [],
      currentPage: 1,
      loading: false,
      error: null,
      hasMore: false,
      fetchPage: vi.fn(),
    });

    render(<Repositories username="test" />);
    expect(screen.getByText('repositories.noRepos')).toBeDefined();
  });

  it('handles pagination', async () => {
    const user = userEvent.setup();
    const mockFetchPage = vi.fn();
    vi.mocked(useRepositoryPagination.useRepositoryPagination).mockReturnValue({
      repositories: mockRepos,
      currentPage: 1,
      loading: false,
      error: null,
      hasMore: true,
      fetchPage: mockFetchPage,
    });

    render(<Repositories username="test" />);
    
    const pageButton = screen.getByLabelText('2');
    await user.click(pageButton);
    
    expect(mockFetchPage).toHaveBeenCalledWith(2);
  });
});
