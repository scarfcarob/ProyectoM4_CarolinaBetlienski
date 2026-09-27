
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
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      await onEdit(title.trim(), description.trim());
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="border border-violet-200 bg-violet-50/30 rounded-2xl p-4 space-y-3 transition-all">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
          />
        </div>
        <div className="flex items-center gap-2 justify-end pt-1">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl px-4 py-2 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-xs font-semibold rounded-xl px-4 py-2 transition-colors shadow-sm"
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`group border rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between gap-3 ${
      task.completed 
        ? 'bg-gray-50/60 border-gray-200' 
        : 'bg-white border-gray-200 hover:border-violet-200 hover:shadow-md'
    }`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          className="mt-1 h-5 w-5 rounded-md border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer accent-violet-600 transition-transform active:scale-95"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <span className={`text-base font-semibold wrap-break-word ${
              task.completed ? 'line-through text-gray-400' : 'text-gray-900'
            }`}>
              {task.title}
            </span>
            <span
              className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                task.completed
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/50'
                  : 'text-amber-700 bg-amber-50 border border-amber-200/50'
              }`}
            >
              {task.completed ? 'Completada' : 'Pendiente'}
            </span>
          </div>

          {task.description && (
            <p className={`text-sm mt-1 wrap-break-word ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}

          {task.createdAt && (
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Creada el {formatDate(task.createdAt)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 sm:border-0 sm:pt-0">
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs font-semibold text-violet-600 hover:text-violet-800 hover:bg-violet-50 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="text-xs font-semibold text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}