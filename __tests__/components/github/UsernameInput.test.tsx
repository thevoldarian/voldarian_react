import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsernameInput } from '../../../src/components/github/UsernameInput';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('UsernameInput', () => {
  it('renders input and button', () => {
    const mockOnSubmit = vi.fn();
    render(<UsernameInput onSubmit={mockOnSubmit} loading={false} suggestedUsers={['user1']} />);

    expect(screen.getByPlaceholderText('usernamePlaceholder')).toBeDefined();
    expect(screen.getByText('load')).toBeDefined();
  });

  it('calls onSubmit when button clicked', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    render(<UsernameInput onSubmit={mockOnSubmit} loading={false} suggestedUsers={[]} defaultUsername='testuser' />);

    const button = screen.getByText('load');
    await act(async () => {
      await user.click(button);
    });
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('renders suggested users', () => {
    const mockOnSubmit = vi.fn();
    render(<UsernameInput onSubmit={mockOnSubmit} loading={false} suggestedUsers={['user1', 'user2']} />);

    expect(screen.getByText('user1')).toBeDefined();
    expect(screen.getByText('user2')).toBeDefined();
  });

  it('calls onSubmit with suggested user when clicked', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    render(<UsernameInput onSubmit={mockOnSubmit} loading={false} suggestedUsers={['user1']} />);
    await act(async () => {
      await user.click(screen.getByText('user1'));
    });
    expect(mockOnSubmit).toHaveBeenCalledWith('user1');
  });

  it('does not call onSubmit when input is empty', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    render(<UsernameInput onSubmit={mockOnSubmit} loading={false} suggestedUsers={[]} />);

    const input = screen.getByPlaceholderText('usernamePlaceholder');
    await act(async () => {
      await user.clear(input);
      await user.click(screen.getByText('load'));
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles Enter key press', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    render(<UsernameInput onSubmit={mockOnSubmit} loading={false} suggestedUsers={[]} defaultUsername='testuser' />);

    const input = screen.getByPlaceholderText('usernamePlaceholder');
    await act(async () => {
      await user.type(input, '{Enter}');
    });
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('does not submit on non-Enter key press', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    render(<UsernameInput onSubmit={mockOnSubmit} loading={false} suggestedUsers={[]} defaultUsername='testuser' />);

    const input = screen.getByPlaceholderText('usernamePlaceholder');
    await act(async () => {
      await user.type(input, 'a');
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
