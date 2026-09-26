
import { useState } from 'react';
import type { Task } from '../types/task';
import { formatDate } from '../utils/formatDate';

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
      <li className="border border-gray-200 rounded-xl p-4 space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg px-4 py-1.5 transition-colors"
          >
            Guardar
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg px-4 py-1.5 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
        />
        <span className={task.completed ? 'line-through text-gray-400' : 'text-gray-900 font-medium'}>
          {task.title}
        </span>
        <span
          className={
            task.completed
              ? 'text-xs font-medium text-green-600 bg-green-50 rounded-full px-2 py-0.5'
              : 'text-xs font-medium text-amber-600 bg-amber-50 rounded-full px-2 py-0.5'
          }
        >
          {task.completed ? 'Hecha' : 'Pendiente'}
        </span>
      </label>

      {task.description && <p className="text-sm text-gray-500 pl-6">{task.description}</p>}

      {task.createdAt && (
        <p className="text-xs text-gray-400 pl-6">Creada el {formatDate(task.createdAt)}</p>
      )}

      <div className="flex gap-3 pl-6">
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-violet-600 hover:underline font-medium"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="text-sm text-red-600 hover:underline font-medium"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}