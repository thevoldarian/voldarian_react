import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@cloudscape-design/components/app-layout';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar } from '../../store/slices/preferencesSlice';
import TopNav from './TopNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed } = useAppSelector(state => state.preferences);

  const navigationItems = useMemo(
    () => [
      { type: 'link' as const, text: t('navigation.home'), href: '/' },
      { type: 'link' as const, text: t('navigation.about'), href: '/about' },
      { type: 'link' as const, text: t('navigation.projects'), href: '/projects' },
      { type: 'link' as const, text: t('navigation.contact'), href: '/contact' },
    ],
    [t],
  );

  return (
    <>
      <TopNav />
      <AppLayout
        headerSelector='#top-nav'
        navigationWidth={200}
        stickyNotifications
        navigation={
          <SideNavigation
            activeHref={location.pathname}
            onFollow={event => {
              event.preventDefault();
              navigate(event.detail.href);
            }}
            items={navigationItems}
          />
        }
        navigationOpen={!sidebarCollapsed}
        onNavigationChange={() => dispatch(toggleSidebar())}
        content={children}
        toolsHide
      />
    </>
  );
}
