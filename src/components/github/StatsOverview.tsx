import { useTranslation } from 'react-i18next';
import { Container, Header, SpaceBetween, ColumnLayout, KeyValuePairs } from '@cloudscape-design/components';
import type { GitHubUser } from '../../services/githubService';

interface StatsOverviewProps {
  userData: GitHubUser;
  totalStars: number;
}

export const StatsOverview = ({ userData, totalStars }: StatsOverviewProps) => {
  const { t } = useTranslation('githubDashboard');

  return (
    <Container>
      <SpaceBetween size='l'>
        <Header variant='h2'>{t('overview.statsTitle')}</Header>
        <ColumnLayout columns={4} variant='text-grid'>
          <KeyValuePairs
            columns={1}
            items={[
              {
                label: t('overview.publicRepos'),
                value: userData?.public_repos ?? 0,
              },
            ]}
          />
          <KeyValuePairs
            columns={1}
            items={[
              {
                label: t('overview.followers'),
                value: userData?.followers ?? 0,
              },
            ]}
          />
          <KeyValuePairs
            columns={1}
            items={[
              {
                label: t('overview.following'),
                value: userData?.following ?? 0,
              },
            ]}
          />
          <KeyValuePairs
            columns={1}
            items={[
              {
                label: t('overview.totalStars'),
                value: totalStars ?? 0,
              },
            ]}
          />
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
};
