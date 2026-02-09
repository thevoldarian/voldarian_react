import { useTranslation } from 'react-i18next';
import { Box, Container, Header, SpaceBetween, Link, Alert } from '@cloudscape-design/components';

export default function Contact() {
  const { t } = useTranslation('contact');

  const emailUser = 'thevoldarian';
  const emailDomain = 'gmail.com';
  const email = `${emailUser}@${emailDomain}`;

  return (
    <SpaceBetween size='l'>
      <Container header={<Header variant='h1'>{t('title')}</Header>}>
        <SpaceBetween size='m'>
          <Box variant='p'>{t('intro')}</Box>

          <Box>
            <Box variant='h3'>{t('email.title')}</Box>
            <Link external href={`mailto:${email}`}>
              {email}
            </Link>
          </Box>

          <Box>
            <Box variant='h3'>{t('social.title')}</Box>
            <SpaceBetween size='s'>
              <Link external href='https://www.linkedin.com/in/raymond-beauchamp/'>
                {t('social.linkedin')}
              </Link>
              <Link external href='https://github.com/thevoldarian'>
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
