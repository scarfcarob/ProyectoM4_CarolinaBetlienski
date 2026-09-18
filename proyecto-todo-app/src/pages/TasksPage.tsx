
import { useTasks } from '../hooks/useTasks';

export function TasksPage() {
    const { tasks, loading, error, addTask } = useTasks();

    async function handleTestAdd() {
        await addTask({ title: 'Tarea de prueba', description: 'Probando el hook' });
    }

    if (loading) {
        return <p>Cargando tareas...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>Mis tareas</h1>
            <button onClick={handleTestAdd}>Agregar tarea de prueba</button>

            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {task.title} — {task.completed ? 'completada' : 'pendiente'}
                    </li>
                ))}
            </ul>

            {/* Provisorio para depurar en consola */}
            <pre>{JSON.stringify(tasks, null, 2)}</pre>
        </div>
    );
};



