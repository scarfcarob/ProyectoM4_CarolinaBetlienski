
import { useTasks } from '../hooks/useTasks';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { Spinner } from '../components/Spinner';
import { ErrorMessage } from '../components/ErrorMessage';
import type { Task } from '../types/task';

export function TasksPage() {
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
    return <Spinner size="md" />;
    }

    return (
    <div>
        <h1>Mis tareas</h1>
        <TaskForm onAdd={addTask} />
        {error && <ErrorMessage message={error} />}
        <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onDelete={removeTask}
        onEdit={handleEdit}
        />
    </div>
    );
}



