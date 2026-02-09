import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../src/store';
import About from '../../src/pages/About';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('About', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Provider store={store}>
        <About />
      </Provider>,
    );
    expect(container).toBeDefined();
  });

  it('renders title', () => {
    render(
      <Provider store={store}>
        <About />
      </Provider>,
    );
    expect(screen.getByText('title')).toBeDefined();
  });
});
