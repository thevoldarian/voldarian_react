import { useTranslation } from 'react-i18next';
import { Box, Container, Header } from '@cloudscape-design/components';
import SpaceBetween from '@cloudscape-design/components/space-between';

export default function Home() {
  const { t } = useTranslation('home');

  return (
    <SpaceBetween size='l'>
      <Container>
        <SpaceBetween size='m'>
          <Header variant='h1'>{t('title')}</Header>
          <Box variant='p'>{t('subtitle')}</Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
