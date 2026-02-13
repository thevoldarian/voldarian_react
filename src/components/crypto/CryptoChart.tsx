import { Box, Container, Header, SpaceBetween, Spinner, Alert, Button, LineChart } from '@cloudscape-design/components';
import { useCryptoChart } from '../../hooks/useCryptoChart';
import type { CryptoCoin } from '../../types/crypto';

interface CryptoChartProps {
  coin: CryptoCoin | null;
  selectedDays?: number;
  onDaysChange?: (days: number) => void;
}

/**
 * Display cryptocurrency price trend (placeholder using Box for now)
 * Cloudscape LineChart requires specific data format, will implement with proper chart library integration
 */
export const CryptoChart = ({ coin, selectedDays = 1, onDaysChange }: CryptoChartProps) => {
  const { chartData, loading, error } = useCryptoChart(coin?.id || null, coin?.name || null, selectedDays);

  const handleDaysChange = (days: number) => {
    onDaysChange?.(days);
  };

  if (!coin) {
    return (
      <Container header={<Header variant='h2'>Price Trend</Header>}>
        <Box textAlign='center' padding='l' color='text-body-secondary'>
          Select a cryptocurrency to view its price trend
        </Box>
      </Container>
    );
  }

  return (
    <Container
      header={
        <Header
          variant='h2'
          actions={
            <SpaceBetween direction='horizontal' size='xs'>
              {[1, 7, 30].map(days => (
                <Button
                  key={days}
                  variant={selectedDays === days ? 'primary' : 'normal'}
                  onClick={() => handleDaysChange(days)}
                  data-testid={`chart-days-${days}`}
                >
                  {days === 1 ? '24h' : days === 7 ? '7d' : '30d'}
                </Button>
              ))}
            </SpaceBetween>
          }
        >
          {coin.name} Price Trend
        </Header>
      }
    >
      <SpaceBetween size='m'>
        {loading && (
          <Box textAlign='center' padding='l'>
            <Spinner size='large' data-testid='chart-loading' />
          </Box>
        )}

        {error && (
          <Alert type='error' dismissible={false} data-testid='chart-error'>
            {error}
          </Alert>
        )}

        {!loading && !error && chartData && (
          <LineChart
            series={[
              {
                title: `${coin.name} Price (USD)`,
                type: 'line',
                data: chartData.series[0].data.map((point, idx) => ({
                  x: idx,
                  y: typeof point.y === 'number' ? Math.round(point.y * 100) / 100 : 0,
                })),
              },
            ]}
            height={300}
            xDomain={[0, chartData.series[0].data.length - 1]}
            yDomain={[
              Math.min(...chartData.series[0].data.map(p => (typeof p.y === 'number' ? p.y : 0))) * 0.99,
              Math.max(...chartData.series[0].data.map(p => (typeof p.y === 'number' ? p.y : 0))) * 1.01,
            ]}
            xScaleType='linear'
            yScaleType='linear'
            hideFilter
            hideLegend={false}
            data-testid={`chart-${coin.id}`}
          />
        )}

        {!loading && !error && !chartData && (
          <Box textAlign='center' padding='m' color='text-body-secondary'>
            No chart data available
          </Box>
        )}
      </SpaceBetween>
    </Container>
  );
};
