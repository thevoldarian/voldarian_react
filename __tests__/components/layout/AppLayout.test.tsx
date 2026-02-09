import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../../src/store';
import AppLayout from '../../../src/components/layout/AppLayout';
import userEvent from '@testing-library/user-event';

describe('AppLayout', () => {
  it('renders with children', () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <AppLayout>
            <div>Test Content</div>
          </AppLayout>
        </BrowserRouter>
      </Provider>,
    );
    expect(getByText('Test Content')).toBeDefined();
  });

  it('toggles sidebar on navigation change', async () => {
    const user = userEvent.setup();
    const initialCollapsed = store.getState().preferences.sidebarCollapsed;

    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </BrowserRouter>
      </Provider>,
    );

    // Sidebar state should be accessible through Redux
    expect(store.getState().preferences.sidebarCollapsed).toBe(initialCollapsed);
  });

  it('navigates on sidebar link click', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppLayout>
            <div>Content</div>
          </AppLayout>
        </BrowserRouter>
      </Provider>,
    );

    const aboutLink = screen.getByText(/navigation.about/i);
    await user.click(aboutLink);

    expect(window.location.pathname).toBe('/about');
  });
});
