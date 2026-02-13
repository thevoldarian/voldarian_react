import { describe, it, expect, vi } from 'vitest';
import { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../src/store';
import DataTable from '../../../src/pages/projects/DataTable';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('DataTable', () => {
  it('renders without crashing', () => {
    const { container } = renderWithProvider(<DataTable />);
    expect(container).toBeDefined();
  });

  it('renders demo warning', () => {
    renderWithProvider(<DataTable />);
    expect(screen.getByText('demoWarning')).toBeDefined();
  });

  it('renders title', () => {
    renderWithProvider(<DataTable />);
    expect(screen.getByText('title')).toBeDefined();
  });

  it('renders employee view toggle', () => {
    renderWithProvider(<DataTable />);
    expect(screen.getByText('adminView')).toBeDefined();
  });

  it('renders export CSV button', () => {
    renderWithProvider(<DataTable />);
    expect(screen.getByText('exportCSV')).toBeDefined();
  });

  it('renders search filter', () => {
    renderWithProvider(<DataTable />);
    expect(screen.getByPlaceholderText('searchPlaceholder')).toBeDefined();
  });

  it('renders employee data', () => {
    renderWithProvider(<DataTable />);
    expect(screen.getByText('EMP001')).toBeDefined();
  });
});
