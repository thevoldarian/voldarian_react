import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../src/store';
import TopNav from '../../../src/components/layout/TopNav';
import userEvent from '@testing-library/user-event';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}));

describe('TopNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders without crashing', () => {
    const { container } = render(
      <Provider store={store}>
        <TopNav />
      </Provider>,
    );
    expect(container).toBeDefined();
  });

  it('renders theme toggle button', () => {
    render(
      <Provider store={store}>
        <TopNav />
      </Provider>,
    );
    expect(screen.getByRole('button', { name: /theme.light/i })).toBeDefined();
  });

  it('toggles theme on button click', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <TopNav />
      </Provider>,
    );

    const themeButton = screen.getByRole('button', { name: /theme.light/i });
    await user.click(themeButton);

    expect(store.getState().preferences.theme).toBe('dark');
  });

  it('toggles theme from dark to light', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <TopNav />
      </Provider>,
    );

    const darkButton = screen.getByRole('button', { name: /theme.dark/i });
    await user.click(darkButton);

    expect(store.getState().preferences.theme).toBe('light');
  });

  it('renders language selector', () => {
    render(
      <Provider store={store}>
        <TopNav />
      </Provider>,
    );
    expect(screen.getByRole('button', { name: /language.en/i })).toBeDefined();
  });

  it('changes language on menu item click', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <TopNav />
      </Provider>,
    );

    const languageButton = screen.getByRole('button', { name: /language.en/i });
    await user.click(languageButton);

    const spanishOption = screen.getByText(/language.es/i);
    await user.click(spanishOption);

    expect(store.getState().preferences.language).toBe('es');
  });
});
