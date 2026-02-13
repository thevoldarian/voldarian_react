import type { Employee } from '../types/employee';

export const exportToCSV = (employees: Employee[], filename: string = 'employees.csv') => {
  const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Position', 'Hire Date', 'Salary'];

  const rows = employees.map(emp => [
    emp.id,
    emp.firstName,
    emp.lastName,
    emp.email,
    emp.phone,
    emp.department,
    emp.position,
    emp.hireDate,
    emp.salary.toString(),
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
