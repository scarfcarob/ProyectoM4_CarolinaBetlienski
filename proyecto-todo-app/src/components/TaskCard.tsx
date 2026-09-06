
interface TaskCardProps {
  title: string;
  completed: boolean;
  onToggle: () => void;
}

export function TaskCard({ title, completed, onToggle }: TaskCardProps) {
  return (
    <li>
      <label>
        <input type="checkbox" checked={completed} onChange={onToggle} />
        {' '}{title} — {completed ? 'Hecha ✅' : 'Pendiente'}
      </label>
    </li>
  );
}