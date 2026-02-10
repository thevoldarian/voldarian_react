import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { githubService, type GitHubRepo } from '../services/githubService';
import { apiCache } from '../utils/cache';

interface UseRepositoryPaginationResult {
  repositories: GitHubRepo[];
  currentPage: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchPage: (page: number) => Promise<void>;
}

export const useRepositoryPagination = (username: string | null): UseRepositoryPaginationResult => {
  const { t } = useTranslation('errors');
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(
    async (page: number) => {
      if (!username) return;

      const cacheKey = `repos:${username}:${page}`;
      const cached = apiCache.get<GitHubRepo[]>(cacheKey);

      if (cached) {
        setRepositories(cached);
        setCurrentPage(page);
        setHasMore(cached.length === 10);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const repos = await githubService.getRepositories(username, page, 10);
        setRepositories(repos);
        setCurrentPage(page);
        setHasMore(repos.length === 10);
        apiCache.set(cacheKey, repos);
      } catch (err) {
        setError(err instanceof Error ? t(`${err.message}`) : t('api.fetchReposFailed'));
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    },
    [username, t],
  );

  return { repositories, currentPage, loading, error, hasMore, fetchPage };
};
