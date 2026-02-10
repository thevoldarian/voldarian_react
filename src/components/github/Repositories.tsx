import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Table, Box, Link, Badge, Pagination, Spinner } from '@cloudscape-design/components';
import { useRepositoryPagination } from '../../hooks/useRepositoryPagination';

interface RepositoriesProps {
  username: string;
}

export const Repositories = ({ username }: RepositoriesProps) => {
  const { t } = useTranslation('githubDashboard');
  const { repositories, currentPage, loading, error, hasMore, fetchPage } = useRepositoryPagination(username);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  if (loading && repositories.length === 0) {
    return (
      <Container>
        <Box textAlign='center' padding='xxl'>
          <Spinner size='large' />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      {error && (
        <Box margin={{ bottom: 'm' }}>
          <Box variant='p' color='text-status-error'>
            {error}
          </Box>
        </Box>
      )}
      <Table
        wrapLines
        variant='borderless'
        columnDefinitions={[
          {
            id: 'name',
            header: t('repositories.name'),
            cell: item => (
              <Link href={item.html_url} external>
                {item.name}
              </Link>
            ),
            minWidth: 100,
          },
          {
            id: 'description',
            header: t('repositories.description'),
            cell: item => (
              <Box variant='span' fontSize='body-s'>
                {item.description || '-'}
              </Box>
            ),
            minWidth: 150,
          },
          {
            id: 'language',
            header: t('repositories.language'),
            cell: item => (item.language ? <Badge color='blue'>{item.language}</Badge> : '-'),
            width: 120,
          },
          {
            id: 'stars',
            header: t('repositories.stars'),
            cell: item => item.stargazers_count,
            width: 80,
          },
          {
            id: 'forks',
            header: t('repositories.forks'),
            cell: item => item.forks_count,
            width: 80,
          },
        ]}
        items={repositories}
        loading={loading}
        empty={<Box textAlign='center'>{t('repositories.noRepos')}</Box>}
        pagination={
          repositories.length > 0 ? (
            <Pagination
              currentPageIndex={currentPage}
              pagesCount={hasMore ? currentPage + 1 : currentPage}
              disabled={loading}
              onChange={({ detail }) => fetchPage(detail.currentPageIndex)}
            />
          ) : null
        }
      />
    </Container>
  );
};
