import { SpaceBetween, Select, Button, Box, Container } from '@cloudscape-design/components';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

interface RefreshControlsProps {
  currentInterval: number;
  onIntervalChange?: (ms: number) => void;
  onManualRefresh?: () => Promise<void>;
  lastUpdated: string | null;
  refreshing?: boolean;
}

/**
 * Controls for auto-refresh interval and manual refresh
 */
export const RefreshControls = ({
  currentInterval,
  onIntervalChange,
  onManualRefresh,
  lastUpdated,
  refreshing = false,
}: RefreshControlsProps) => {
  const { t } = useTranslation('cryptoDashboard');
  const getRelativeTime = (isoString: string | null): string => {
    if (!isoString) return '—';

    const now = new Date();
    const updated = new Date(isoString);
    const diffMs = now.getTime() - updated.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffSeconds < 60) {
      return 'just now';
    }
    if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    return updated.toLocaleString();
  };

  const [displayTime, setDisplayTime] = useState<string>(() => getRelativeTime(lastUpdated));

  // Update display time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTime(getRelativeTime(lastUpdated));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [lastUpdated]);

  const intervalOptions = [
    { value: '15000', label: t('intervals.15s') || '15 seconds' },
    { value: '30000', label: t('intervals.30s') || '30 seconds' },
    { value: '60000', label: t('intervals.1m') || '1 minute' },
    { value: '300000', label: t('intervals.5m') || '5 minutes' },
  ];

  // Handle the case where interval might be undefined
  const safeCurrentInterval = currentInterval || 60000;

  return (
    <Container>
      <SpaceBetween direction='horizontal' size='m' alignItems='center'>
        {/* Interval Selector */}
        <Box>
          <Select
            selectedOption={{
              value: String(safeCurrentInterval),
              label: intervalOptions.find(opt => opt.value === String(safeCurrentInterval))?.label || 'Auto-refresh',
            }}
            options={intervalOptions}
            onChange={(event: { detail: { selectedOption: { value?: string } } }) => {
              const value = parseInt(event.detail.selectedOption.value || '60000', 10);
              onIntervalChange?.(value);
            }}
            data-testid='refresh-interval-select'
            triggerVariant='option'
          />
        </Box>

        {/* Manual Refresh Button */}
        <Button
          onClick={() => onManualRefresh?.()}
          loading={refreshing}
          disabled={refreshing}
          data-testid='manual-refresh-button'
        >
          {t('manualRefresh') || 'Refresh Now'}
        </Button>

        {/* Last Updated */}
        <Box variant='small' color='text-body-secondary' data-testid='last-updated'>
          {t('lastUpdated')}: {displayTime}
        </Box>
      </SpaceBetween>
    </Container>
  );
};
