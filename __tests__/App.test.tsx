import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders under construction', () => {
    render(<App />);
    const heading = screen.getByText(/under construction/i);
    expect(heading).toBeDefined();
  });
});
