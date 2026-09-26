
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { Spinner } from '../components/Spinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { SendSummaryButton } from '../components/SendSummaryButton';
import type { Task } from '../types/task';

export function TasksPage() {
  const { user } = useAuth();
  const { tasks, loading, error, addTask, editTask, removeTask } = useTasks();

  async function handleToggle(task: Task) {
    try {
      await editTask(task.id, { completed: !task.completed });
    } catch (err) {
      console.error('Error al actualizar la tarea:', err);
    }
  }

  function handleEdit(taskId: string, title: string, description: string) {
    return editTask(taskId, { title, description });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="md" />
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Mis tareas</h1>
          <SendSummaryButton
            userEmail={user?.email ?? null}
            summary={{ totalTasks, completedTasks, pendingTasks }}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <TaskForm onAdd={addTask} />
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={removeTask}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
}

