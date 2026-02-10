import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { githubService, type GitHubUser } from '../services/githubService';
import { validateGitHubUsername, sanitizeGitHubUsername } from '../utils/validation';
import { apiCache } from '../utils/cache';

interface UseGitHubDataResult {
  userData: GitHubUser | null;
  totalStars: number;
  loading: boolean;
  error: string | null;
  fetchUser: (username: string) => Promise<void>;
}

export const useGitHubData = (): UseGitHubDataResult => {
  const { t } = useTranslation('errors');
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [totalStars, setTotalStars] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(
    async (username: string) => {
      const sanitized = sanitizeGitHubUsername(username);
      const validation = validateGitHubUsername(sanitized);

      if (!validation.valid) {
        setUserData(null);
        setTotalStars(0);
        setError(validation.errorKey ? t(validation.errorKey) : t('api.invalidUsername'));
        return;
      }

      const cacheKey = `user:${sanitized}`;
      const cached = apiCache.get<{ user: GitHubUser; stars: number }>(cacheKey);

      if (cached) {
        setUserData(cached.user);
        setTotalStars(cached.stars);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const [user, stars] = await Promise.all([
          githubService.getUser(sanitized),
          githubService.getTotalStars(sanitized),
        ]);
        setUserData(user);
        setTotalStars(stars);
        apiCache.set(cacheKey, { user, stars });
      } catch (err) {
        setError(err instanceof Error ? t(`${err.message}`) : t('api.fetchDataFailed'));
        setUserData(null);
        setTotalStars(0);
      } finally {
        setLoading(false);
      }
    },
    [t],
  );

  return { userData, totalStars, loading, error, fetchUser };
};
