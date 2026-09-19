
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
    return <p>No tenés tareas todavía. ¡Agregá la primera!</p>;
  }

  return (
    <ul>
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