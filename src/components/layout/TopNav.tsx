import TopNavigation from '@cloudscape-design/components/top-navigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setTheme, setLanguage } from '../../store/slices/preferencesSlice';
import { SUPPORTED_LANGUAGES, type Language } from '../../constants/languages';

export default function TopNav() {
  const { t, i18n } = useTranslation('common');
  const dispatch = useAppDispatch();
  const { theme, language } = useAppSelector(state => state.preferences);

  useEffect(() => {
    document.body.classList.toggle('awsui-dark-mode', theme === 'dark');
  }, [theme]);

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
  };

  const handleLanguageChange = (lang: string) => {
    if (SUPPORTED_LANGUAGES.includes(lang as Language)) {
      dispatch(setLanguage(lang as Language));
      i18n.changeLanguage(lang);
    }
  };

  return (
    <div id='top-nav' style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <TopNavigation
        identity={{
          href: '/',
          title: 'The Voldarian',
        }}
        utilities={[
          {
            type: 'menu-dropdown',
            text: t(`language.${language}`),
            description: t('language.select'),
            items: SUPPORTED_LANGUAGES.map(lang => ({
              id: lang,
              text: t(`language.${lang}`),
            })),
            onItemClick: ({ detail }) => handleLanguageChange(detail.id),
          },
          {
            type: 'button',
            text: t(`theme.${theme}`),
            title: t('theme.toggle'),
            onClick: handleThemeChange,
          },
        ]}
      />
    </div>
  );
}
