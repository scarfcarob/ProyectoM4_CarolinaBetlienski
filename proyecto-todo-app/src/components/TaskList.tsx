
import { TaskCard } from './TaskCard';

interface Tarea {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskListProps {
  tareas: Tarea[];
  onToggle: (id: string) => void;
}

export function TaskList({ tareas, onToggle }: TaskListProps) {
  return (
    <ul>
      {tareas.map((tarea) => (
        <TaskCard
          key={tarea.id}
          title={tarea.title}
          completed={tarea.completed}
          onToggle={() => onToggle(tarea.id)}
        />
      ))}
    </ul>
  );
}