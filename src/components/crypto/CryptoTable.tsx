import { Table, Box, Container, Header, Spinner, Alert } from '@cloudscape-design/components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CryptoCoin } from '../../types/crypto';

interface CryptoTableProps {
  coins: CryptoCoin[];
  selectedCoinId?: string | null;
  onCoinSelect?: (coinId: string) => void;
  loading?: boolean;
  error?: string | null;
}

type SortField = 'rank' | 'name' | 'currentPrice' | 'change24h' | 'marketCap' | 'volume24h';
type SortDirection = 'asc' | 'desc';

/**
 * Display cryptocurrency market data in a sortable table
 */
export const CryptoTable = ({ coins, selectedCoinId, onCoinSelect, loading = false, error }: CryptoTableProps) => {
  const { t } = useTranslation('crypto');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (cap: number): string => {
    if (cap >= 1000000000) {
      return `$${(cap / 1000000000).toFixed(1)}B`;
    }
    return `$${(cap / 1000000).toFixed(1)}M`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort coins
  const sortedCoins = [...coins].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortField) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'currentPrice':
        aValue = a.currentPrice;
        bValue = b.currentPrice;
        break;
      case 'change24h':
        aValue = a.change24h;
        bValue = b.change24h;
        break;
      case 'marketCap':
        aValue = a.marketCap;
        bValue = b.marketCap;
        break;
      case 'volume24h':
        aValue = a.volume24h;
        bValue = b.volume24h;
        break;
      default:
        aValue = a.rank;
        bValue = b.rank;
    }

    if (typeof aValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    }

    return sortDirection === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
  });

  if (error) {
    return (
      <Container header={<Header variant='h2'>Market Data</Header>}>
        <Alert type='error' dismissible={false} data-testid='table-error'>
          {error}
        </Alert>
      </Container>
    );
  }

  if (loading && coins.length === 0) {
    return (
      <Container header={<Header variant='h2'>Market Data</Header>}>
        <Box textAlign='center' padding='l'>
          <Spinner size='large' data-testid='table-loading' />
        </Box>
      </Container>
    );
  }

  return (
    <Container header={<Header variant='h2'>Market Data</Header>}>
      {coins.length === 0 ? (
        <Box textAlign='center' padding='m' color='text-body-secondary'>
          No cryptocurrency data available
        </Box>
      ) : (
        <Table
          columnDefinitions={[
            {
              id: 'rank',
              header: (
                <button
                  onClick={() => handleSort('rank')}
                  data-testid='sort-rank'
                  style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}
                >
                  {t('tableHeaders.rank')} {sortField === 'rank' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </button>
              ),
              cell: (item: CryptoCoin) => `#${item.rank}`,
              width: '60px',
            },
            {
              id: 'name',
              header: (
                <button
                  onClick={() => handleSort('name')}
                  data-testid='sort-name'
                  style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}
                >
                  {t('tableHeaders.name')} {sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </button>
              ),
              cell: (item: CryptoCoin) => (
                <Box>
                  <Box variant='strong'>{item.name}</Box>
                  <Box variant='small' color='text-body-secondary'>
                    {item.symbol}
                  </Box>
                </Box>
              ),
            },
            {
              id: 'price',
              header: (
                <button
                  onClick={() => handleSort('currentPrice')}
                  data-testid='sort-price'
                  style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}
                >
                  {t('tableHeaders.price')} {sortField === 'currentPrice' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </button>
              ),
              cell: (item: CryptoCoin) => formatPrice(item.currentPrice),
              width: '130px',
            },
            {
              id: 'change24h',
              header: (
                <button
                  onClick={() => handleSort('change24h')}
                  data-testid='sort-change24h'
                  style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}
                >
                  {t('tableHeaders.change24h')} {sortField === 'change24h' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </button>
              ),
              cell: (item: CryptoCoin) => {
                const isPositive = item.change24h >= 0;
                return (
                  <span
                    style={{
                      color: isPositive ? '#1aaa00' : '#d13212',
                      fontWeight: '600',
                    }}
                    data-testid={`change-${item.id}`}
                  >
                    {isPositive ? '+' : ''}
                    {item.change24h.toFixed(2)}%
                  </span>
                );
              },
              width: '100px',
            },
            {
              id: 'marketCap',
              header: (
                <button
                  onClick={() => handleSort('marketCap')}
                  data-testid='sort-market-cap'
                  style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}
                >
                  {t('tableHeaders.marketCap')} {sortField === 'marketCap' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </button>
              ),
              cell: (item: CryptoCoin) => formatMarketCap(item.marketCap),
            },
            {
              id: 'volume24h',
              header: (
                <button
                  onClick={() => handleSort('volume24h')}
                  data-testid='sort-volume'
                  style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'inherit', padding: 0 }}
                >
                  {t('tableHeaders.volume')} {sortField === 'volume24h' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </button>
              ),
              cell: (item: CryptoCoin) => formatMarketCap(item.volume24h),
            },
          ]}
          items={sortedCoins}
          onRowClick={(event: { detail: { item: CryptoCoin } }) => {
            const coin = event.detail.item;
            onCoinSelect?.(coin.id);
          }}
          selectedItems={selectedCoinId ? [sortedCoins.find(c => c.id === selectedCoinId) || sortedCoins[0]] : []}
          selectionType='single'
          loading={loading}
          variant='container'
          data-testid='crypto-table'
        />
      )}
    </Container>
  );
};
