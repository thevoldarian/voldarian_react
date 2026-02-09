import { useTranslation } from 'react-i18next';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setTheme, setLanguage } from '../../store/slices/preferencesSlice';
import type { Language } from '../../store/slices/preferencesSlice';

export default function TopNav() {
  const { t, i18n } = useTranslation('common');
  const dispatch = useAppDispatch();
  const { theme, language } = useAppSelector(state => state.preferences);

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    document.body.classList.toggle('awsui-dark-mode', newTheme === 'dark');
  };

  const handleLanguageChange = (lang: Language) => {
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
  };

  return (
    <div id='top-nav'>
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
            items: [
              { id: 'en', text: t('language.en') },
              { id: 'es', text: t('language.es') },
              { id: 'de', text: t('language.de') },
              { id: 'ja', text: t('language.ja') },
              { id: 'ar', text: t('language.ar') },
            ],
            onItemClick: ({ detail }) => handleLanguageChange(detail.id as Language),
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
