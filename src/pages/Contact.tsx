import { useTranslation } from 'react-i18next';
import { Box, Container, Header, SpaceBetween, Link, Alert } from '@cloudscape-design/components';
import { CONTACT_EMAIL, LINKEDIN_URL, GITHUB_URL } from '../constants/contact';

export default function Contact() {
  const { t } = useTranslation('contact');

  return (
    <SpaceBetween size='l'>
      <Container header={<Header variant='h1'>{t('title')}</Header>}>
        <SpaceBetween size='m'>
          <Box variant='p'>{t('intro')}</Box>

          <Box>
            <Box variant='h3'>{t('email.title')}</Box>
            <Link external href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </Link>
          </Box>

          <Box>
            <Box variant='h3'>{t('social.title')}</Box>
            <SpaceBetween size='s'>
              <Link external href={LINKEDIN_URL}>
                {t('social.linkedin')}
              </Link>
              <Link external href={GITHUB_URL}>
                {t('social.github')}
              </Link>
            </SpaceBetween>
          </Box>

          <Box>
            <Box variant='h3'>{t('availability.title')}</Box>
            <Box variant='p'>{t('availability.status')}</Box>
          </Box>
        </SpaceBetween>
      </Container>

      <Alert type='info'>{t('formComingSoon')}</Alert>
    </SpaceBetween>
  );
}
