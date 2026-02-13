import { useTranslation } from 'react-i18next';
import { Box, Container, Header, SpaceBetween, Cards, Button, Badge } from '@cloudscape-design/components';

interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  technologies: string[];
  route: string;
}

export default function Projects() {
  const { t } = useTranslation('projects');

  const projects: Project[] = [
    {
      id: 'github-dashboard',
      titleKey: 'githubDashboard.title',
      descriptionKey: 'githubDashboard.description',
      technologies: ['React', 'TypeScript', 'Redux', 'GitHub API'],
      route: '/projects/github-dashboard',
    },
    {
      id: 'data-table',
      titleKey: 'dataTable.title',
      descriptionKey: 'dataTable.description',
      technologies: ['React', 'TypeScript', 'Cloudscape Table'],
      route: '/projects/data-table',
    },
    {
      id: 'wizard',
      titleKey: 'wizard.title',
      descriptionKey: 'wizard.description',
      technologies: ['React', 'TypeScript', 'Zod', 'i18n'],
      route: '/projects/wizard',
    },
    {
      id: 'crypto-dashboard',
      titleKey: 'cryptoDashboard.title',
      descriptionKey: 'cryptoDashboard.description',
      technologies: ['React', 'TypeScript', 'CoinGecko API', 'Charts'],
      route: '/projects/crypto-dashboard',
    },
  ];

  return (
    <SpaceBetween size='l'>
      <Container header={<Header variant='h1'>{t('title')}</Header>}>
        <Box variant='p'>{t('intro')}</Box>
      </Container>

      <Cards
        cardDefinition={{
          header: item => <Box variant='h2'>{t(item.titleKey)}</Box>,
          sections: [
            {
              id: 'description',
              content: item => <Box variant='p'>{t(item.descriptionKey)}</Box>,
            },
            {
              id: 'technologies',
              content: item => (
                <SpaceBetween direction='horizontal' size='xs'>
                  {item.technologies.map(tech => (
                    <Badge key={tech} color='blue'>
                      {tech}
                    </Badge>
                  ))}
                </SpaceBetween>
              ),
            },
            {
              id: 'action',
              content: item => (
                <Button href={item.route} variant='primary'>
                  {t('viewDemo')}
                </Button>
              ),
            },
          ],
        }}
        items={projects}
        cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }]}
      />
    </SpaceBetween>
  );
}
