import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEmployeeTable } from '../../src/hooks/useEmployeeTable';

describe('useEmployeeTable', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useEmployeeTable());
    
    expect(result.current.viewMode).toBe('employee');
    expect(result.current.employees.length).toBe(10);
    expect(result.current.selectedItems).toEqual([]);
    expect(result.current.filteringText).toBe('');
    expect(result.current.currentPageIndex).toBe(1);
    expect(result.current.isAdminView).toBe(false);
  });

  it('toggles view mode', () => {
    const { result } = renderHook(() => useEmployeeTable());
    
    act(() => {
      result.current.setViewMode('admin');
    });
    
    expect(result.current.viewMode).toBe('admin');
    expect(result.current.isAdminView).toBe(true);
  });

  it('filters employees by search text', () => {
    const { result } = renderHook(() => useEmployeeTable());
    
    act(() => {
      result.current.setFilteringText('John');
    });
    
    expect(result.current.filteredEmployees.length).toBe(2);
  });

  it('filters employees by department', () => {
    const { result } = renderHook(() => useEmployeeTable());
    
    act(() => {
      result.current.setSelectedDepartment('Engineering');
    });
    
    expect(result.current.filteredEmployees.every(emp => emp.department === 'Engineering')).toBe(true);
  });

  it('sorts employees ascending', () => {
    const { result } = renderHook(() => useEmployeeTable());
    
    act(() => {
      result.current.setSortingColumn({ sortingField: 'firstName', isDescending: false });
    });
    
    const firstEmployee = result.current.paginatedEmployees[0];
    expect(firstEmployee.firstName).toBe('David');
  });

  it('sorts employees descending', () => {
    const { result } = renderHook(() => useEmployeeTable());
    
    act(() => {
      result.current.setSortingColumn({ sortingField: 'firstName', isDescending: true });
    });
    
    const firstEmployee = result.current.paginatedEmployees[0];
    expect(firstEmployee.firstName).toBe('Sarah');
  });

  it('sorts by salary', () => {
    const { result } = renderHook(() => useEmployeeTable());
    
    act(() => {
      result.current.setSortingColumn({ sortingField: 'salary', isDescending: true });
    });
    
    const firstEmployee = result.current.paginatedEmployees[0];
    expect(firstEmployee.salary).toBe(98000);
  });

  it('adds new employee', () => {
    const { result } = renderHook(() => useEmployeeTable());
    const initialCount = result.current.employees.length;
    
    const newEmployee = {
      id: 'EMP999',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      phone: '555-0000',
      department: 'Engineering',
      position: 'Tester',
      hireDate: '2024-01-01',
      salary: 70000,
    };
    
    act(() => {
      result.current.handleAddEmployee(newEmployee);
    });
    
    expect(result.current.employees.length).toBe(initialCount + 1);
    expect(result.current.employees[0]).toEqual(newEmployee);
    expect(result.current.currentPageIndex).toBe(1);
  });

  it('starts editing a cell', () => {
    const { result } = renderHook(() => useEmployeeTable());
    
    act(() => {
      result.current.startEdit('EMP001', 'email', 'test@test.com');
    });
    
    expect(result.current.editingCell).toEqual({ id: 'EMP001', field: 'email' });
    expect(result.current.editValue).toBe('test@test.com');
  });

  it('saves edit for string field', () => {
    const { result } = renderHook(() => useEmployeeTable());
    
    act(() => {
      result.current.startEdit('EMP001', 'email', 'old@test.com');
    });
    
    act(() => {
      result.current.setEditValue('new@test.com');
    });
    
    act(() => {
      result.current.saveEdit();
    });
    
    const employee = result.current.employees.find(emp => emp.id === 'EMP001');
    expect(employee?.email).toBe('new@test.com');
    expect(result.current.editingCell).toBeNull();
  });

  it('saves edit for salary field', () => {
    const { result } = renderHook(() => useEmployeeTable());
    
    act(() => {
      result.current.startEdit('EMP001', 'salary', 95000);
    });
    
    act(() => {
      result.current.setEditValue('100000');
    });
    
    act(() => {
      result.current.saveEdit();
    });
    
    const employee = result.current.employees.find(emp => emp.id === 'EMP001');
    expect(employee?.salary).toBe(100000);
  });

  it('cancels edit', () => {
    const { result } = renderHook(() => useEmployeeTable());
    
    act(() => {
      result.current.startEdit('EMP001', 'email', 'test@test.com');
      result.current.cancelEdit();
    });
    
    expect(result.current.editingCell).toBeNull();
    expect(result.current.editValue).toBe('');
  });

  it('deletes selected employees', () => {
    const { result } = renderHook(() => useEmployeeTable());
    const initialCount = result.current.employees.length;
    
    act(() => {
      result.current.setSelectedItems([result.current.employees[0], result.current.employees[1]]);
    });
    
    act(() => {
      result.current.handleDelete();
    });
    
    expect(result.current.employees.length).toBe(initialCount - 2);
    expect(result.current.selectedItems).toEqual([]);
  });

  it('paginates employees', () => {
    const { result } = renderHook(() => useEmployeeTable());
    
    expect(result.current.paginatedEmployees.length).toBe(10);
    expect(result.current.pageSize).toBe(10);
  });

  it('generates unique departments list', () => {
    const { result } = renderHook(() => useEmployeeTable());
    
    expect(result.current.departments).toContain('All');
    expect(result.current.departments).toContain('Engineering');
    expect(result.current.departments).toContain('Marketing');
  });
});
