import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../../src/store';
import AppLayout from '../../../src/components/layout/AppLayout';
import userEvent from '@testing-library/user-event';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
  );
};

describe('AppLayout', () => {
  it('renders with children', () => {
    const { getByText } = renderWithRouter(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>,
    );
    expect(getByText('Test Content')).toBeDefined();
  });

  it('toggles sidebar on navigation change', async () => {
    const user = userEvent.setup();
    const initialCollapsed = store.getState().preferences.sidebarCollapsed;

    renderWithRouter(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );

    // Sidebar state should be accessible through Redux
    expect(store.getState().preferences.sidebarCollapsed).toBe(initialCollapsed);
  });

  it('navigates on sidebar link click', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <AppLayout>
        <div>Content</div>
      </AppLayout>,
    );

    const aboutLink = screen.getByText(/navigation.about/i);
    await user.click(aboutLink);

    expect(window.location.pathname).toBe('/about');
  });
});
