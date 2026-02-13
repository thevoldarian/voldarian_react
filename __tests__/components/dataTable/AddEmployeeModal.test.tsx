import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddEmployeeModal } from '../../../src/components/dataTable/AddEmployeeModal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('AddEmployeeModal', () => {
  const defaultProps = {
    visible: true,
    onDismiss: vi.fn(),
    onAdd: vi.fn(),
  };

  it('renders modal when visible', () => {
    render(<AddEmployeeModal {...defaultProps} />);
    expect(screen.getByText('addEmployeeModal.title')).toBeDefined();
  });

  it('does not render when not visible', () => {
    const { container } = render(<AddEmployeeModal {...defaultProps} visible={false} />);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('calls onDismiss when cancel clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<AddEmployeeModal {...defaultProps} onDismiss={onDismiss} />);
    await act(async () => {
      await user.click(screen.getByText('addEmployeeModal.cancel'));
    });
    expect(onDismiss).toHaveBeenCalled();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<AddEmployeeModal {...defaultProps} />);
    await act(async () => {
      await user.click(screen.getByText('addEmployeeModal.add'));
    });
    expect(screen.getAllByText('validation.required').length).toBeGreaterThan(0);
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<AddEmployeeModal {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText('john.doe@company.com');
    await act(async () => {
      await user.type(emailInput, 'invalid-email');
      await user.click(screen.getByText('addEmployeeModal.add'));
    });
    expect(screen.getByText('validation.invalidEmail')).toBeDefined();
  });

  it('validates salary is a number', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddEmployeeModal {...defaultProps} onAdd={onAdd} />);
    await act(async () => {
      await user.type(screen.getByPlaceholderText('75000'), '-100');
      await user.click(screen.getByText('addEmployeeModal.add'));
    });
    expect(onAdd).not.toHaveBeenCalled();
  });
});
