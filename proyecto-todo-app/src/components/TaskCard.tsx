
import { useState } from 'react';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (title: string, description: string) => Promise<void>;
}

export function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  async function handleSave() {
    if (!title.trim()) return;
    await onEdit(title.trim(), description.trim());
    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <button onClick={handleSave}>Guardar</button>
        <button onClick={handleCancel}>Cancelar</button>
      </li>
    );
  }

  return (
    <li>
      <label>
        <input type="checkbox" checked={task.completed} onChange={onToggle} />
        {' '}<span>{task.title}</span> — <span>{task.completed ? 'Hecha ✅' : 'Pendiente'}</span>
      </label>
      {task.description && <p>{task.description}</p>}
      <button onClick={() => setIsEditing(true)}>Editar</button>
      <button onClick={onDelete}>Eliminar</button>
    </li>
  );
}