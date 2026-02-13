import { Box, SpaceBetween } from '@cloudscape-design/components';
import type { CryptoCoin } from '../../types/crypto';

interface CryptoCardProps {
  coin: CryptoCoin;
  selected?: boolean;
  onClick?: () => void;
}

/**
 * Display a single cryptocurrency with price and 24h change
 */
export const CryptoCard = ({ coin, selected = false, onClick }: CryptoCardProps) => {
  const isPositiveChange = coin.change24h >= 0;
  const changeColor = isPositiveChange ? '#1aaa00' : '#d13212'; // green : red (Cloudscape colors)

  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(2)}K`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatMarketCap = (cap: number): string => {
    if (cap >= 1000000000) {
      return `$${(cap / 1000000000).toFixed(1)}B`;
    }
    if (cap >= 1000000) {
      return `$${(cap / 1000000).toFixed(1)}M`;
    }
    return `$${cap.toFixed(0)}`;
  };

  const containerStyle = selected
    ? {
        border: '2px solid #0972d3',
        boxShadow: '0 0 8px rgba(9, 114, 211, 0.3)',
      }
    : {};

  return (
    <div
      style={{
        ...containerStyle,
        padding: '16px',
        borderRadius: '4px',
      }}
      onClick={onClick}
      data-testid={`crypto-card-${coin.id}`}
    >
      <Box variant='h2' textAlign='center'>
        {coin.name}
      </Box>
      <SpaceBetween size='m'>
        {/* Coin Icon */}
        <Box textAlign='center'>
          <img
            src={coin.image}
            alt={coin.name}
            style={{ width: '80px', height: '80px' }}
            data-testid={`crypto-icon-${coin.id}`}
          />
        </Box>

        {/* Symbol and Price */}
        <Box>
          <Box variant='h3' textAlign='center' data-testid={`crypto-symbol-${coin.id}`}>
            {coin.symbol}
          </Box>
          <Box variant='h1' textAlign='center' data-testid={`crypto-price-${coin.id}`} margin={{ top: 'xs' }}>
            {formatPrice(coin.currentPrice)}
          </Box>
        </Box>

        {/* 24h Change */}
        <div
          style={{
            color: changeColor,
            fontSize: '18px',
            fontWeight: '600',
            padding: '8px 12px',
            backgroundColor: isPositiveChange ? 'rgba(26, 170, 0, 0.1)' : 'rgba(209, 50, 18, 0.1)',
            borderRadius: '4px',
            textAlign: 'center',
          }}
          data-testid={`crypto-change-${coin.id}`}
        >
          {isPositiveChange ? '↑' : '↓'} {Math.abs(coin.change24h).toFixed(2)}%
        </div>

        {/* Market Cap */}
        <Box variant='small' textAlign='center' color='text-body-secondary'>
          Market Cap: {formatMarketCap(coin.marketCap)}
        </Box>
      </SpaceBetween>
    </div>
  );
};
