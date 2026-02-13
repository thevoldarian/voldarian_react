import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../src/store';
import About from '../../src/pages/About';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('About', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
  it('renders without crashing', () => {
    const { container } = renderWithProvider(<About />);
    expect(container).toBeDefined();
  });

  it('renders title', () => {
    renderWithProvider(<About />);
    expect(screen.getByText('title')).toBeDefined();
  });
});
