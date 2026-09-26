
import type { Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, title: string, description: string) => Promise<void>;
}

export function TaskList({ tasks, onToggle, onDelete, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-6">No tenés tareas todavía. ¡Agregá la primera!</p>;
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={() => onToggle(task)}
          onDelete={() => onDelete(task.id)}
          onEdit={(title, description) => onEdit(task.id, title, description)}
        />
      ))}
    </ul>
  );
}