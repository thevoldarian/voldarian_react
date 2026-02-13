import { useState, useMemo } from 'react';
import type { Employee, ViewMode } from '../types/employee';
import employeesData from '../data/employees.json';

export const useEmployeeTable = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('employee');
  const [employees, setEmployees] = useState<Employee[]>(employeesData.employees);
  const [selectedItems, setSelectedItems] = useState<Employee[]>([]);
  const [filteringText, setFilteringText] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortingColumn, setSortingColumn] = useState<{ sortingField: string; isDescending: boolean }>({
    sortingField: 'id',
    isDescending: false,
  });
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof Employee } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const pageSize = 10;
  const isAdminView = viewMode === 'admin';

  const departments = useMemo(
    () => ['All', ...Array.from(new Set(employees.map(emp => emp.department))).sort()],
    [employees],
  );

  const sortedEmployees = useMemo(() => {
    return [...employees].sort((a, b) => {
      const field = sortingColumn.sortingField as keyof Employee;
      const aValue = a[field];
      const bValue = b[field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortingColumn.isDescending ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortingColumn.isDescending ? bValue - aValue : aValue - bValue;
      }

      return 0;
    });
  }, [employees, sortingColumn]);

  const filteredEmployees = useMemo(() => {
    return sortedEmployees.filter(emp => {
      const matchesSearch = `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.department} ${emp.position}`
        .toLowerCase()
        .includes(filteringText.toLowerCase());
      const matchesDepartment = !selectedDepartment || emp.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [sortedEmployees, filteringText, selectedDepartment]);

  const paginatedEmployees = useMemo(() => {
    return filteredEmployees.slice((currentPageIndex - 1) * pageSize, currentPageIndex * pageSize);
  }, [filteredEmployees, currentPageIndex, pageSize]);

  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees([newEmployee, ...employees]);
    setCurrentPageIndex(1);
  };

  const startEdit = (id: string, field: keyof Employee, value: string | number) => {
    setEditingCell({ id, field });
    setEditValue(String(value));
  };

  const saveEdit = () => {
    if (!editingCell) return;

    const currentValue = editValue;
    setEmployees(prevEmployees =>
      prevEmployees.map(emp => {
        if (emp.id === editingCell.id) {
          const field = editingCell.field;
          if (field === 'salary') {
            return { ...emp, [field]: Number(currentValue) };
          }
          return { ...emp, [field]: currentValue };
        }
        return emp;
      }),
    );
    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleDelete = () => {
    const itemsToDelete = selectedItems;
    setEmployees(prevEmployees => prevEmployees.filter(emp => !itemsToDelete.find(selected => selected.id === emp.id)));
    setSelectedItems([]);
  };

  return {
    viewMode,
    setViewMode,
    employees,
    selectedItems,
    setSelectedItems,
    filteringText,
    setFilteringText,
    currentPageIndex,
    setCurrentPageIndex,
    showAddModal,
    setShowAddModal,
    sortingColumn,
    setSortingColumn,
    editingCell,
    editValue,
    setEditValue,
    selectedDepartment,
    setSelectedDepartment,
    pageSize,
    isAdminView,
    departments,
    paginatedEmployees,
    filteredEmployees,
    handleAddEmployee,
    startEdit,
    saveEdit,
    cancelEdit,
    handleDelete,
  };
};
