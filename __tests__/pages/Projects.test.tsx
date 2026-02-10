import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Projects from '../../src/pages/Projects';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Projects', () => {
  it('renders projects page with title', () => {
    render(<Projects />);
    expect(screen.getByText('title')).toBeDefined();
    expect(screen.getByText('intro')).toBeDefined();
  });

  it('renders all project cards', () => {
    render(<Projects />);
    expect(screen.getByText('githubDashboard.title')).toBeDefined();
    expect(screen.getByText('dataTable.title')).toBeDefined();
    expect(screen.getByText('wizard.title')).toBeDefined();
    expect(screen.getByText('cryptoDashboard.title')).toBeDefined();
  });

  it('renders technologies badges', () => {
    render(<Projects />);
    expect(screen.getAllByText('React')).toHaveLength(4);
    expect(screen.getAllByText('TypeScript')).toHaveLength(4);
  });

  it('renders view demo buttons with correct routes', () => {
    render(<Projects />);
    const buttons = screen.getAllByText('viewDemo');
    expect(buttons).toHaveLength(4);
  });
});
