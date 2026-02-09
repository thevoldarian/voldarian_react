import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../src/store';
import Contact from '../../src/pages/Contact';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Contact', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Provider store={store}>
        <Contact />
      </Provider>,
    );
    expect(container).toBeDefined();
  });

  it('renders title', () => {
    render(
      <Provider store={store}>
        <Contact />
      </Provider>,
    );
    expect(screen.getByText('title')).toBeDefined();
  });

  it('renders email link', () => {
    render(
      <Provider store={store}>
        <Contact />
      </Provider>,
    );
    expect(screen.getByText('thevoldarian@gmail.com')).toBeDefined();
  });
});
