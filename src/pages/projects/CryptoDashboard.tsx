import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Header, SpaceBetween, Box, Alert, Spinner, ColumnLayout } from '@cloudscape-design/components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCoin, setRefreshInterval } from '../../store/cryptoSlice';
import { useCryptoData } from '../../hooks/useCryptoData';
import { useCryptoRefresh } from '../../hooks/useCryptoRefresh';
import { CryptoTable } from '../../components/crypto/CryptoTable';
import { CryptoChart } from '../../components/crypto/CryptoChart';
import { RefreshControls } from '../../components/crypto/RefreshControls';
import { PriceAlert } from '../../components/crypto/PriceAlert';
import { CryptoCard } from '../../components/crypto/CryptoCard';

/**
 * Main Crypto Market Dashboard page
 * Displays top 10 cryptocurrencies with real-time prices and charts
 */
export default function CryptoDashboard() {
  const { t } = useTranslation('cryptoDashboard');
  const dispatch = useAppDispatch();

  // Redux state
  const coins = useAppSelector(state => state.crypto.coins);
  const selectedCoinId = useAppSelector(state => state.crypto.selectedCoinId);
  const refreshInterval = useAppSelector(state => state.crypto.refreshInterval);
  const lastUpdated = useAppSelector(state => state.crypto.lastUpdated);

  // Hooks
  const { loading, error, refetch } = useCryptoData();
  useCryptoRefresh(refetch);
  const [chartDays, setChartDays] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Initial fetch on component mount
  useEffect(() => {
    if (coins.length === 0) {
      refetch();
    }
  }, [coins.length, refetch]);

  // Handle manual refresh
  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  // Handle interval change
  const handleIntervalChange = (ms: number) => {
    dispatch(setRefreshInterval(ms));
  };

  // Handle coin selection from table
  const handleCoinSelect = (coinId: string) => {
    dispatch(selectCoin(coinId));
    setChartDays(1); // Reset chart to 24h when changing coin
  };

  // Find selected coin for display
  const selectedCoin = coins.find(c => c.id === selectedCoinId) || coins[0] || null;

  return (
    <SpaceBetween size='l'>
      {/* Header */}
      <Container header={<Header variant='h1'>{t('title')}</Header>}>
        <Box variant='p'>{t('description')}</Box>
      </Container>

      {/* Price Alert */}
      {coins.length > 0 && <PriceAlert coins={coins} />}

      {/* Refresh Controls */}
      {!error && (
        <RefreshControls
          currentInterval={refreshInterval}
          onIntervalChange={handleIntervalChange}
          onManualRefresh={handleManualRefresh}
          lastUpdated={lastUpdated}
          refreshing={refreshing || loading}
        />
      )}

      {/* Loading/Error States */}
      {loading && coins.length === 0 && (
        <Container>
          <Box textAlign='center' padding='xxl'>
            <Spinner size='large' data-testid='dashboard-loading' />
          </Box>
        </Container>
      )}

      {error && (
        <Alert type='error' dismissible={false} data-testid='dashboard-error'>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      {coins.length > 0 && !error && (
        <ColumnLayout columns={2} variant='text-grid'>
          {/* Left: Table */}
          <CryptoTable
            coins={coins}
            selectedCoinId={selectedCoinId}
            onCoinSelect={handleCoinSelect}
            loading={loading}
          />

          {/* Right: Card + Chart */}
          <SpaceBetween size='m'>
            {selectedCoin && (
              <>
                <CryptoCard
                  coin={selectedCoin}
                  selected
                  onClick={() => {
                    /* Already selected */
                  }}
                />
                <CryptoChart coin={selectedCoin} selectedDays={chartDays} onDaysChange={setChartDays} />
              </>
            )}
          </SpaceBetween>
        </ColumnLayout>
      )}

      {/* Empty State */}
      {coins.length === 0 && !loading && !error && (
        <Container>
          <Box textAlign='center' padding='l' color='text-body-secondary'>
            {t('noData')}
          </Box>
        </Container>
      )}
    </SpaceBetween>
  );
}
