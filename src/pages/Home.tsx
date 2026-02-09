import { useTranslation } from 'react-i18next';
import { Box, Container, Header, Button, SpaceBetween, Link } from '@cloudscape-design/components';

export default function Home() {
  const { t } = useTranslation('home');

  return (
    <SpaceBetween size='xxl'>
      <Container>
        <SpaceBetween size='l'>
          <Header variant='h1'>{t('hero.name')}</Header>
          <Box variant='h3' color='text-body-secondary'>
            {t('hero.title')}
          </Box>
          <Box variant='p' fontSize='body-m' color='text-body-secondary'>
            {t('hero.intro')}
          </Box>
          <SpaceBetween direction='horizontal' size='m'>
            <Button variant='primary' href='/projects' ariaLabel={t('hero.viewProjects')}>
              {t('hero.viewProjects')}
            </Button>
            <Button href='/contact' ariaLabel={t('hero.contactMe')}>
              {t('hero.contactMe')}
            </Button>
          </SpaceBetween>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant='h2'>{t('techStack.title')}</Header>}>
        <SpaceBetween size='m'>
          <Box>
            <Box variant='strong'>{t('techStack.frontend')}</Box>
            <Box variant='p'>{t('techStack.frontendList')}</Box>
          </Box>
          <Box>
            <Box variant='strong'>{t('techStack.backend')}</Box>
            <Box variant='p'>{t('techStack.backendList')}</Box>
          </Box>
          <Box>
            <Box variant='strong'>{t('techStack.cloud')}</Box>
            <Box variant='p'>{t('techStack.cloudList')}</Box>
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant='h2'>{t('links.title')}</Header>}>
        <SpaceBetween size='s'>
          <Box>
            <Link external href='https://github.com/thevoldarian' ariaLabel={t('links.githubAriaLabel')}>
              {t('links.github')}
            </Link>
          </Box>
          <Box>
            <Link
              external
              href='https://www.linkedin.com/in/raymond-beauchamp/'
              ariaLabel={t('links.linkedinAriaLabel')}
            >
              {t('links.linkedin')}
            </Link>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
