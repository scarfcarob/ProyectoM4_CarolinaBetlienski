
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { Spinner } from '../components/Spinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { SendSummaryButton } from '../components/SendSummaryButton';
import type { Task } from '../types/task';

export function TasksPage() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const { tasks, loading, error, addTask, editTask, removeTask } = useTasks();
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleToggle(task: Task) {
    setActionError(null);
    try {
      await editTask(task.id, { completed: !task.completed });
    } catch (err) {
      setActionError('No se pudo actualizar la tarea. Intentá de nuevo.');
      console.error('Error al actualizar la tarea:', err);
    }
  }

  async function handleDelete(taskId: string) {
    setActionError(null);
    try {
      await removeTask(taskId);
    } catch (err) {
      setActionError('No se pudo eliminar la tarea. Intentá de nuevo.');
      console.error('Error al eliminar la tarea:', err);
    }
  }

  function handleEdit(taskId: string, title: string, description: string) {
    return editTask(taskId, { title, description });
  }

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Spinner size="md" />
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen bg-gray-50/60 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">

        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-sm">
              {user?.email?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs text-gray-400 font-medium">Sesión iniciada como</p>
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="self-end sm:self-auto text-xs font-semibold text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors"
          >
            Cerrar sesión
          </button>
        </header>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Mis Tareas</h1>
            <p className="text-sm text-gray-500 mt-0.5">Organizá y gestioná tus pendientes diarios</p>
          </div>
          <SendSummaryButton
            userEmail={user?.email ?? null}
            summary={{ totalTasks, completedTasks, pendingTasks }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-100 shadow-sm text-center sm:text-left">
            <p className="text-xs font-medium text-gray-500">Totales</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{totalTasks}</p>
          </div>
          <div className="bg-amber-50/20 p-3.5 sm:p-4 rounded-2xl border border-amber-100/60 shadow-sm text-center sm:text-left">
            <p className="text-xs font-medium text-amber-600">Pendientes</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-700 mt-1">{pendingTasks}</p>
          </div>
          <div className="bg-emerald-50/20 p-3.5 sm:p-4 rounded-2xl border border-emerald-100/60 shadow-sm text-center sm:text-left">
            <p className="text-xs font-medium text-emerald-600">Completadas</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1">{completedTasks}</p>
          </div>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Agregar nueva tarea</h2>
          <TaskForm onAdd={addTask} />
        </section>

        {error && <ErrorMessage message={error} />}
        {actionError && <ErrorMessage message={actionError} />}

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </section>
      </div>
    </div>
  );
}

