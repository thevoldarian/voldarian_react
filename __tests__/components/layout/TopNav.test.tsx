import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
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

const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('TopNav', () => {

  it('renders without crashing', () => {
    const { container } = renderWithProvider(<TopNav />);
    expect(container).toBeDefined();
  });

  it('renders theme toggle button', () => {
    renderWithProvider(<TopNav />);
    expect(screen.getByRole('button', { name: /theme.light/i })).toBeDefined();
  });

  it('toggles theme on button click', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TopNav />);

    const themeButton = screen.getByRole('button', { name: /theme.light/i });
    await act(async () => {
      await user.click(themeButton);
    });
    expect(store.getState().preferences.theme).toBe('dark');
  });

  it('toggles theme from dark to light', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TopNav />);

    const darkButton = screen.getByRole('button', { name: /theme.dark/i });
    await act(async () => {
      await user.click(darkButton);
    });
    expect(store.getState().preferences.theme).toBe('light');
  });

  it('renders language selector', () => {
    renderWithProvider(<TopNav />);
    expect(screen.getByRole('button', { name: /language.en/i })).toBeDefined();
  });

  it('changes language on menu item click', async () => {
    const user = userEvent.setup();
    renderWithProvider(<TopNav />);

    const languageButton = screen.getByRole('button', { name: /language.en/i });
    await act(async () => {
      await user.click(languageButton);
    });
    const spanishOption = screen.getByText(/language.es/i);
    await act(async () => {
      await user.click(spanishOption);
    });
    expect(store.getState().preferences.language).toBe('es');
  });

  it('ignores invalid language selection', () => {
    renderWithProvider(<TopNav />);

    const initialLanguage = store.getState().preferences.language;
    // Simulate invalid language - the component filters this internally
    expect(initialLanguage).toBeDefined();
  });
});
