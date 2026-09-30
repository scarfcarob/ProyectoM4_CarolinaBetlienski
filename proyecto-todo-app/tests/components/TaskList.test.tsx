
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from '../../src/components/TaskList';
import type { Task } from '../../src/types/task';

function buildTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Tarea de prueba',
    description: '',
    completed: false,
    userId: 'user-abc',
    createdAt: null,
    ...overrides,
  };
}

describe('TaskList', () => {
  it('muestra el estado vacío cuando no hay tareas (caso borde)', () => {
    render(<TaskList tasks={[]} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText('No tienes tareas pendientes')).toBeInTheDocument();
  });

  it('renderiza una tarjeta por cada tarea recibida', () => {
    const tasks = [
      buildTask({ id: '1', title: 'Comprar leche' }),
      buildTask({ id: '2', title: 'Sacar la basura' }),
    ];

    render(<TaskList tasks={tasks} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);

    expect(screen.getByText('Comprar leche')).toBeInTheDocument();
    expect(screen.getByText('Sacar la basura')).toBeInTheDocument();
  });

  it('llama a onToggle con la tarea correcta al tildar el checkbox', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    const task = buildTask({ id: 'abc', title: 'Tildar esta' });

    render(<TaskList tasks={[task]} onToggle={onToggle} onDelete={vi.fn()} onEdit={vi.fn()} />);
    await user.click(screen.getByRole('checkbox'));

    expect(onToggle).toHaveBeenCalledWith(task);
  });

  it('llama a onDelete con el id correcto al eliminar', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    const task = buildTask({ id: 'xyz-999', title: 'Eliminar esta' });

    render(<TaskList tasks={[task]} onToggle={vi.fn()} onDelete={onDelete} onEdit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /eliminar/i }));

    expect(onDelete).toHaveBeenCalledWith('xyz-999');
  });
});