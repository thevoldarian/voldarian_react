import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../src/store';
import Home from '../../src/pages/Home';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Home', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );
    expect(container).toBeDefined();
  });
});
