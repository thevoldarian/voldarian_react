import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SpaceBetween, Input, Button, FormField, Box } from '@cloudscape-design/components';

interface UsernameInputProps {
  onSubmit: (username: string) => void;
  loading: boolean;
  suggestedUsers: string[];
  defaultUsername?: string;
}

export const UsernameInput = ({ onSubmit, loading, suggestedUsers, defaultUsername = '' }: UsernameInputProps) => {
  const { t } = useTranslation('githubDashboard');
  const [inputValue, setInputValue] = useState(defaultUsername);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
    }
  };

  const handleQuickSelect = (user: string) => {
    setInputValue(user);
    onSubmit(user);
  };

  return (
    <SpaceBetween size='m'>
      <FormField label={t('usernameLabel')} description={t('usernameDescription')}>
        <SpaceBetween direction='horizontal' size='xs'>
          <Input
            value={inputValue}
            onChange={({ detail }) => setInputValue(detail.value)}
            placeholder={t('usernamePlaceholder')}
            onKeyDown={e => e.detail.key === 'Enter' && handleSubmit()}
          />
          <Button onClick={handleSubmit} loading={loading}>
            {t('load')}
          </Button>
        </SpaceBetween>
      </FormField>
      <SpaceBetween direction='horizontal' size='xs'>
        <Box variant='small'>{t('trySuggested')}</Box>
        {suggestedUsers.map(user => (
          <Button key={user} variant='inline-link' onClick={() => handleQuickSelect(user)} disabled={loading}>
            {user}
          </Button>
        ))}
      </SpaceBetween>
    </SpaceBetween>
  );
};
