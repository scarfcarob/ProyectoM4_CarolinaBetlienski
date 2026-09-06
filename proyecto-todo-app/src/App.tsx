
import { useState } from 'react';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';

interface Tarea {
  id: string;
  title: string;
  completed: boolean;
}

function App() {
  const [tareas, setTareas] = useState<Tarea[]>([
    { id: '1', title: 'Aprender React', completed: false },
    { id: '2', title: 'Configurar Firebase', completed: false },
    { id: '3', title: 'Armar el scaffolding', completed: true },
  ]);

  function toggleCompleted(id: string) {
    setTareas((tareasActuales) =>
      tareasActuales.map((tarea) =>
        tarea.id === id ? { ...tarea, completed: !tarea.completed } : tarea
      )
    );
  }

  function addTarea(title: string) {
    const nuevaTarea: Tarea = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };
    setTareas((tareasActuales) => [...tareasActuales, nuevaTarea]);
  }

  return (
    <div>
      <h1>Mis tareas</h1>
      <TaskForm onAdd={addTarea} />
      <TaskList tareas={tareas} onToggle={toggleCompleted} />
    </div>
  );
}

export default App;
