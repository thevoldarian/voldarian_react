import { useTranslation } from 'react-i18next';
import { Box, Container, Header, SpaceBetween, ColumnLayout } from '@cloudscape-design/components';

export default function About() {
  const { t } = useTranslation('about');

  return (
    <SpaceBetween size='l'>
      <Container header={<Header variant='h1'>{t('title')}</Header>}>
        <Box variant='p'>{t('summary')}</Box>
      </Container>

      <Container header={<Header variant='h2'>{t('skills.title')}</Header>}>
        <ColumnLayout columns={3} variant='text-grid'>
          <Box>
            <Box variant='h3'>{t('skills.frontend.title')}</Box>
            <Box variant='p'>{t('skills.frontend.list')}</Box>
          </Box>
          <Box>
            <Box variant='h3'>{t('skills.backend.title')}</Box>
            <Box variant='p'>{t('skills.backend.list')}</Box>
          </Box>
          <Box>
            <Box variant='h3'>{t('skills.cloud.title')}</Box>
            <Box variant='p'>{t('skills.cloud.list')}</Box>
          </Box>
          <Box>
            <Box variant='h3'>{t('skills.tools.title')}</Box>
            <Box variant='p'>{t('skills.tools.list')}</Box>
          </Box>
          <Box>
            <Box variant='h3'>{t('skills.i18n.title')}</Box>
            <Box variant='p'>{t('skills.i18n.list')}</Box>
          </Box>
          <Box>
            <Box variant='h3'>{t('skills.methodologies.title')}</Box>
            <Box variant='p'>{t('skills.methodologies.list')}</Box>
          </Box>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant='h2'>{t('experience.title')}</Header>}>
        <SpaceBetween size='m'>
          <Box>
            <Box variant='h3'>{t('experience.amazon.title')}</Box>
            <Box variant='small' color='text-body-secondary'>
              {t('experience.amazon.duration')}
            </Box>
            <Box variant='p'>{t('experience.amazon.description')}</Box>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
