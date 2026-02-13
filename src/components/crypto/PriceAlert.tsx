import { Alert, Box } from '@cloudscape-design/components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CryptoCoin } from '../../types/crypto';

interface PriceAlertProps {
  coins: CryptoCoin[];
}

/**
 * Display top gainer and loser from cryptocurrency list
 */
export const PriceAlert = ({ coins }: PriceAlertProps) => {
  const { t } = useTranslation('cryptoDashboard');
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || coins.length === 0) {
    return null;
  }

  // Find top gainer (highest positive change)
  const topGainer = coins.reduce((max, coin) => (coin.change24h > max.change24h ? coin : max));

  // Find top loser (lowest/most negative change)
  const topLoser = coins.reduce((min, coin) => (coin.change24h < min.change24h ? coin : min));

  // Only show if there are actually different gainers and losers
  if (topGainer.id === topLoser.id) {
    return null;
  }

  const alertContent = (
    <Box>
      <strong>{t('alert.topGainer') || 'Top Gainer'}:</strong> {topGainer.name} (
      <span style={{ color: '#1aaa00' }}>+{topGainer.change24h.toFixed(2)}%</span>) |{' '}
      <strong>{t('alert.topLoser') || 'Top Loser'}</strong>: {topLoser.name} (
      <span style={{ color: '#d13212' }}>{topLoser.change24h.toFixed(2)}%</span>)
    </Box>
  );

  return (
    <Alert type='info' dismissible onDismiss={() => setDismissed(true)} data-testid='price-alert'>
      {alertContent}
    </Alert>
  );
};
