import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Box, SpaceBetween, FormField, Input, Select, DatePicker, Button } from '@cloudscape-design/components';
import type { Employee } from '../../types/employee';

interface AddEmployeeModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAdd: (employee: Employee) => void;
}

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];

function generateFallbackId(): string {
  return `EMP${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
}

function getUuid(): string {
  const cryptoObj = (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
    return cryptoObj.randomUUID();
  }
  return generateFallbackId();
}

export const AddEmployeeModal = ({ visible, onDismiss, onAdd }: AddEmployeeModalProps) => {
  const { t } = useTranslation('dataTable');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    hireDate: '',
    salary: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = t('validation.required');
    if (!formData.lastName.trim()) newErrors.lastName = t('validation.required');
    if (!formData.email.trim()) newErrors.email = t('validation.required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }
    if (!formData.phone.trim()) newErrors.phone = t('validation.required');
    if (!formData.department) newErrors.department = t('validation.required');
    if (!formData.position.trim()) newErrors.position = t('validation.required');
    if (!formData.hireDate) newErrors.hireDate = t('validation.required');
    if (!formData.salary.trim()) newErrors.salary = t('validation.required');
    else if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      newErrors.salary = t('validation.invalidSalary');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newEmployee: Employee = {
      // Generate a stable unique id for the new employee. Use the Web Crypto API
      // when available for a secure UUID; fall back to a short randomized ID.
      id: getUuid(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      department: formData.department,
      position: formData.position.trim(),
      hireDate: formData.hireDate,
      salary: Number(formData.salary),
    };

    onAdd(newEmployee);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      hireDate: '',
      salary: '',
    });
    setErrors({});
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={handleClose}
      header={t('addEmployeeModal.title')}
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button variant='link' onClick={handleClose}>
              {t('addEmployeeModal.cancel')}
            </Button>
            <Button variant='primary' onClick={handleSubmit}>
              {t('addEmployeeModal.add')}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size='m'>
        <FormField label={t('columns.firstName')} errorText={errors.firstName}>
          <Input
            value={formData.firstName}
            onChange={({ detail }) => setFormData({ ...formData, firstName: detail.value })}
            placeholder='John'
          />
        </FormField>

        <FormField label={t('columns.lastName')} errorText={errors.lastName}>
          <Input
            value={formData.lastName}
            onChange={({ detail }) => setFormData({ ...formData, lastName: detail.value })}
            placeholder='Doe'
          />
        </FormField>

        <FormField label={t('columns.email')} errorText={errors.email}>
          <Input
            value={formData.email}
            onChange={({ detail }) => setFormData({ ...formData, email: detail.value })}
            placeholder='john.doe@company.com'
            type='email'
          />
        </FormField>

        <FormField label={t('columns.phone')} errorText={errors.phone}>
          <Input
            value={formData.phone}
            onChange={({ detail }) => setFormData({ ...formData, phone: detail.value })}
            placeholder='555-123-4567'
          />
        </FormField>

        <FormField label={t('columns.department')} errorText={errors.department}>
          <Select
            selectedOption={formData.department ? { label: formData.department, value: formData.department } : null}
            onChange={({ detail }) => setFormData({ ...formData, department: detail.selectedOption.value || '' })}
            options={DEPARTMENTS.map(dept => ({ label: dept, value: dept }))}
            placeholder={t('addEmployeeModal.selectDepartment')}
          />
        </FormField>

        <FormField label={t('columns.position')} errorText={errors.position}>
          <Input
            value={formData.position}
            onChange={({ detail }) => setFormData({ ...formData, position: detail.value })}
            placeholder='Software Engineer'
          />
        </FormField>

        <FormField label={t('columns.hireDate')} errorText={errors.hireDate}>
          <DatePicker
            value={formData.hireDate}
            onChange={({ detail }) => setFormData({ ...formData, hireDate: detail.value })}
            placeholder='YYYY-MM-DD'
          />
        </FormField>

        <FormField label={t('columns.salary')} errorText={errors.salary}>
          <Input
            value={formData.salary}
            onChange={({ detail }) => setFormData({ ...formData, salary: detail.value })}
            placeholder='75000'
            type='number'
          />
        </FormField>
      </SpaceBetween>
    </Modal>
  );
};
