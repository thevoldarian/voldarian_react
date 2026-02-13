import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../src/store';
import Contact from '../../src/pages/Contact';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('Contact', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
  it('renders without crashing', () => {
    const { container } = renderWithProvider(<Contact />);
    expect(container).toBeDefined();
  });

  it('renders title', () => {
    renderWithProvider(<Contact />);
    expect(screen.getByText('title')).toBeDefined();
  });

  it('renders email link', () => {
    renderWithProvider(<Contact />);
    expect(screen.getByText('thevoldarian@gmail.com')).toBeDefined();
  });
});
