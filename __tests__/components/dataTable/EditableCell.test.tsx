import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableCell } from '../../../src/components/dataTable/EditableCell';

describe('EditableCell', () => {
  const defaultProps = {
    value: 'Test Value',
    isEditing: false,
    onEdit: vi.fn(),
    editValue: '',
    onEditChange: vi.fn(),
    onSave: vi.fn(),
    onCancel: vi.fn(),
  };

  it('renders value when not editing', () => {
    render(<EditableCell {...defaultProps} />);
    expect(screen.getByText('Test Value')).toBeDefined();
  });

  it('calls onEdit when clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<EditableCell {...defaultProps} onEdit={onEdit} />);
    await act(async () => {
      await user.click(screen.getByText('Test Value'));
    });
    expect(onEdit).toHaveBeenCalled();
  });

  it('renders input when editing', () => {
    render(<EditableCell {...defaultProps} isEditing={true} editValue='Edit Value' />);
    const input = screen.getByDisplayValue('Edit Value');
    expect(input).toBeDefined();
  });

  it('calls onEditChange when input changes', async () => {
    const user = userEvent.setup();
    const onEditChange = vi.fn();
    render(<EditableCell {...defaultProps} isEditing={true} editValue='Test' onEditChange={onEditChange} />);
    
    const input = screen.getByDisplayValue('Test');
    await act(async () => {
      await user.type(input, 'a');
    });
    expect(onEditChange).toHaveBeenCalled();
  });

  it('calls onSave on blur', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditableCell {...defaultProps} isEditing={true} editValue='Test' onSave={onSave} />);
    
    const input = screen.getByDisplayValue('Test');
    await act(async () => {
      await user.click(input);
      await user.tab();
    });
    expect(onSave).toHaveBeenCalled();
  });

  it('calls onSave on Enter key', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<EditableCell {...defaultProps} isEditing={true} editValue='Test' onSave={onSave} />);

    const input = screen.getByDisplayValue('Test');
    await act(async () => {
      await user.type(input, '{Enter}');
    });
    expect(onSave).toHaveBeenCalled();
  });

  it('calls onCancel on Escape key', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<EditableCell {...defaultProps} isEditing={true} editValue='Test' onCancel={onCancel} />);
    const input = screen.getByDisplayValue('Test');
    await act(async () => {
      await user.type(input, '{Escape}');
    });
    expect(onCancel).toHaveBeenCalled();
  });
});
