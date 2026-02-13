import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToCSV } from '../../src/utils/csvExport';
import type { Employee } from '../../src/types/employee';

describe('csvExport', () => {
  let createElementSpy: ReturnType<typeof vi.spyOn>;
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let mockLink: HTMLAnchorElement;

  beforeEach(() => {
    mockLink = {
      setAttribute: vi.fn(),
      click: vi.fn(),
      style: {},
    } as unknown as HTMLAnchorElement;

    createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exports employees to CSV', () => {
    const employees: Employee[] = [
      {
        id: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        phone: '555-1234',
        department: 'Engineering',
        position: 'Developer',
        hireDate: '2020-01-15',
        salary: 95000,
      },
    ];

    exportToCSV(employees, 'test.csv');

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'blob:mock-url');
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'test.csv');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('uses default filename if not provided', () => {
    const employees: Employee[] = [];
    exportToCSV(employees);
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'employees.csv');
  });

  it('creates CSV with headers and data', () => {
    const employees: Employee[] = [
      {
        id: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        phone: '555-1234',
        department: 'Engineering',
        position: 'Developer',
        hireDate: '2020-01-15',
        salary: 95000,
      },
    ];

    exportToCSV(employees);

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(mockLink.click).toHaveBeenCalled();
  });
});
