import { useTranslation } from 'react-i18next';
import {
  SpaceBetween,
  Container,
  Header,
  Alert,
  Toggle,
  Button,
  Table,
  Box,
  TextFilter,
  Pagination,
  Select,
} from '@cloudscape-design/components';
import { exportToCSV } from '../../utils/csvExport';
import { maskEmail, maskPhone, formatCurrency, formatDate } from '../../utils/employeeUtils';
import { AddEmployeeModal } from '../../components/dataTable/AddEmployeeModal';
import { EditableCell } from '../../components/dataTable/EditableCell';
import { useEmployeeTable } from '../../hooks/useEmployeeTable';

export default function DataTable() {
  const { t } = useTranslation('dataTable');
  const {
    setViewMode,
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
  } = useEmployeeTable();

  const handleExport = () => {
    exportToCSV(filteredEmployees, `employees-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <SpaceBetween size='l'>
      <Alert type='info' dismissible={false}>
        {t('demoWarning')}
      </Alert>

      <Container
        header={
          <Header
            variant='h1'
            actions={
              <SpaceBetween direction='horizontal' size='xs'>
                <Button iconName='download' onClick={handleExport}>
                  {t('exportCSV')}
                </Button>
                <Toggle
                  checked={isAdminView}
                  onChange={({ detail }) => setViewMode(detail.checked ? 'admin' : 'employee')}
                >
                  {t('adminView')}
                </Toggle>
                {isAdminView && selectedItems.length > 0 && (
                  <Button iconName='remove' onClick={handleDelete}>
                    {t('deleteSelected', { count: selectedItems.length })}
                  </Button>
                )}
                {isAdminView && (
                  <Button variant='primary' iconName='add-plus' onClick={() => setShowAddModal(true)}>
                    {t('addEmployee')}
                  </Button>
                )}
              </SpaceBetween>
            }
          >
            {t('title')}
          </Header>
        }
      >
        <Table
          columnDefinitions={[
            {
              id: 'id',
              header: t('columns.id'),
              cell: item => item.id,
              sortingField: 'id',
              width: 100,
            },
            {
              id: 'name',
              header: t('columns.name'),
              cell: item => `${item.firstName} ${item.lastName}`,
              sortingField: 'firstName',
              minWidth: 150,
            },
            {
              id: 'email',
              header: t('columns.email'),
              cell: item =>
                isAdminView ? (
                  <EditableCell
                    value={item.email}
                    isEditing={editingCell?.id === item.id && editingCell?.field === 'email'}
                    onEdit={() => startEdit(item.id, 'email', item.email)}
                    editValue={editValue}
                    onEditChange={setEditValue}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                  />
                ) : (
                  maskEmail(item.email)
                ),
              sortingField: 'email',
              minWidth: 200,
            },
            {
              id: 'phone',
              header: t('columns.phone'),
              cell: item =>
                isAdminView ? (
                  <EditableCell
                    value={item.phone}
                    isEditing={editingCell?.id === item.id && editingCell?.field === 'phone'}
                    onEdit={() => startEdit(item.id, 'phone', item.phone)}
                    editValue={editValue}
                    onEditChange={setEditValue}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                  />
                ) : (
                  maskPhone(item.phone)
                ),
              width: 150,
            },
            {
              id: 'department',
              header: t('columns.department'),
              cell: item => item.department,
              sortingField: 'department',
              width: 130,
            },
            {
              id: 'position',
              header: t('columns.position'),
              cell: item =>
                isAdminView ? (
                  <EditableCell
                    value={item.position}
                    isEditing={editingCell?.id === item.id && editingCell?.field === 'position'}
                    onEdit={() => startEdit(item.id, 'position', item.position)}
                    editValue={editValue}
                    onEditChange={setEditValue}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                  />
                ) : (
                  item.position
                ),
              sortingField: 'position',
              minWidth: 180,
            },
            {
              id: 'hireDate',
              header: t('columns.hireDate'),
              cell: item => formatDate(item.hireDate),
              sortingField: 'hireDate',
              width: 120,
            },
            {
              id: 'salary',
              header: t('columns.salary'),
              cell: item =>
                isAdminView ? (
                  <EditableCell
                    value={formatCurrency(item.salary)}
                    isEditing={editingCell?.id === item.id && editingCell?.field === 'salary'}
                    onEdit={() => startEdit(item.id, 'salary', item.salary)}
                    editValue={editValue}
                    onEditChange={setEditValue}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                  />
                ) : (
                  '***'
                ),
              sortingField: 'salary',
              width: 120,
            },
          ]}
          items={paginatedEmployees}
          selectionType={isAdminView ? 'multi' : undefined}
          selectedItems={selectedItems}
          onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
          sortingColumn={sortingColumn}
          sortingDescending={sortingColumn.isDescending}
          onSortingChange={({ detail }) =>
            setSortingColumn({
              sortingField: detail.sortingColumn.sortingField || 'id',
              isDescending: detail.isDescending || false,
            })
          }
          loading={false}
          loadingText={t('loading')}
          empty={
            <Box textAlign='center' color='inherit'>
              {t('noEmployees')}
            </Box>
          }
          filter={
            <SpaceBetween direction='horizontal' size='xs'>
              <TextFilter
                filteringText={filteringText}
                filteringPlaceholder={t('searchPlaceholder')}
                onChange={({ detail }) => setFilteringText(detail.filteringText)}
              />
              <Select
                selectedOption={
                  selectedDepartment
                    ? { label: selectedDepartment, value: selectedDepartment }
                    : { label: t('filters.allDepartments'), value: '' }
                }
                onChange={({ detail }) => {
                  setSelectedDepartment(detail.selectedOption.value || '');
                  setCurrentPageIndex(1);
                }}
                options={departments.map(dept => ({
                  label: dept === 'All' ? t('filters.allDepartments') : dept,
                  value: dept === 'All' ? '' : dept,
                }))}
                placeholder={t('filters.selectDepartment')}
              />
            </SpaceBetween>
          }
          pagination={
            <Pagination
              currentPageIndex={currentPageIndex}
              pagesCount={Math.ceil(filteredEmployees.length / pageSize)}
              onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
            />
          }
          variant='container'
        />
      </Container>

      <AddEmployeeModal visible={showAddModal} onDismiss={() => setShowAddModal(false)} onAdd={handleAddEmployee} />
    </SpaceBetween>
  );
}
