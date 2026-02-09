import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Home from '../../src/pages/Home';

describe('Home', () => {
  it('renders without crashing', () => {
    const { container } = render(<Home />);
    expect(container).toBeDefined();
  });
});
