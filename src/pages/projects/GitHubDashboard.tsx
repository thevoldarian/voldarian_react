import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Header, SpaceBetween, Tabs, Spinner, Alert } from '@cloudscape-design/components';
import { useGitHubData } from '../../hooks/useGitHubData';
import { UsernameInput } from '../../components/github/UsernameInput';
import { StatsOverview } from '../../components/github/StatsOverview';
import { Repositories } from '../../components/github/Repositories';
import { Profile } from '../../components/github/Profile';

const SUGGESTED_USERS = ['thevoldarian', 'torvalds', 'gaearon', 'tj', 'sindresorhus'];

export default function GitHubDashboard() {
  const { t } = useTranslation('githubDashboard');
  const [activeTabId, setActiveTabId] = useState('overview');
  const { userData, totalStars, loading, error, fetchUser } = useGitHubData();

  useEffect(() => {
    fetchUser('thevoldarian');
  }, [fetchUser]);

  if (loading && !userData) {
    return (
      <Container>
        <Box textAlign='center' padding='xxl'>
          <Spinner size='large' />
        </Box>
      </Container>
    );
  }

  return (
    <SpaceBetween size='l'>
      <Container header={<Header variant='h1'>{t('title')}</Header>}>
        <SpaceBetween size='m'>
          <Box variant='p'>{t('description')}</Box>
          <UsernameInput
            onSubmit={fetchUser}
            loading={loading}
            suggestedUsers={SUGGESTED_USERS}
            defaultUsername='thevoldarian'
          />
        </SpaceBetween>
      </Container>

      {error && (
        <Container>
          <Alert type='error'>{error}</Alert>
        </Container>
      )}

      {userData && (
        <Tabs
          activeTabId={activeTabId}
          onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
          tabs={[
            {
              id: 'overview',
              label: t('tabs.overview'),
              content: <StatsOverview userData={userData} totalStars={totalStars} />,
            },
            {
              id: 'repositories',
              label: t('tabs.repositories'),
              content: <Repositories username={userData.login} />,
            },
            {
              id: 'profile',
              label: t('tabs.profile'),
              content: <Profile userData={userData} />,
            },
          ]}
        />
      )}
    </SpaceBetween>
  );
}
