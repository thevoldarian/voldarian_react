import { Input } from '@cloudscape-design/components';

interface EditableCellProps {
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  editValue: string;
  onEditChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EditableCell = ({
  value,
  isEditing,
  onEdit,
  editValue,
  onEditChange,
  onSave,
  onCancel,
}: EditableCellProps) => {
  if (!isEditing) {
    return (
      <div onClick={onEdit} style={{ cursor: 'pointer' }}>
        {value}
      </div>
    );
  }

  return (
    <Input
      value={editValue}
      onChange={({ detail }) => onEditChange(detail.value)}
      onBlur={onSave}
      onKeyDown={e => {
        if (e.detail.key === 'Enter') onSave();
        if (e.detail.key === 'Escape') onCancel();
      }}
      autoFocus
    />
  );
};
