import { useTranslation } from 'react-i18next';
import { Container, ColumnLayout, Box, SpaceBetween } from '@cloudscape-design/components';
import type { GitHubUser } from '../../services/githubService';

interface ProfileProps {
  userData: GitHubUser;
}

export const Profile = ({ userData }: ProfileProps) => {
  const { t } = useTranslation('githubDashboard');

  return (
    <Container>
      <SpaceBetween size='l'>
        <ColumnLayout columns={2} variant='text-grid'>
          <div>
            <Box variant='awsui-key-label'>{t('profile.username')}</Box>
            <div>{userData.login}</div>
          </div>
          <div>
            <Box variant='awsui-key-label'>{t('profile.name')}</Box>
            <div>{userData.name || '-'}</div>
          </div>
          <div>
            <Box variant='awsui-key-label'>{t('profile.bio')}</Box>
            <div>{userData.bio || '-'}</div>
          </div>
          <div>
            <Box variant='awsui-key-label'>{t('profile.location')}</Box>
            <div>{userData.location || '-'}</div>
          </div>
          <div>
            <Box variant='awsui-key-label'>{t('profile.joined')}</Box>
            <div>{new Date(userData.created_at).toLocaleDateString()}</div>
          </div>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
};
