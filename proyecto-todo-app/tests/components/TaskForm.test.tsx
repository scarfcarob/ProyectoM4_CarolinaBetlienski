
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../../src/components/TaskForm';

describe('TaskForm', () => {
  it('llama a onAdd con el título y descripción cuando el formulario es válido', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TaskForm onAdd={onAdd} />);

    await user.type(
      screen.getByPlaceholderText('¿Qué tenés pendiente hacer?'),
      '  Comprar pan  '
    );
    await user.type(
      screen.getByPlaceholderText('Añadir una descripción detallada (opcional)'),
      '  Integral  '
    );
    await user.click(screen.getByRole('button', { name: /agregar tarea/i }));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith({ title: 'Comprar pan', description: 'Integral' });
    });
  });

  it('no llama a onAdd y muestra el error de validación si el título está vacío (caso borde)', async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<TaskForm onAdd={onAdd} />);

    await user.click(screen.getByRole('button', { name: /agregar tarea/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ingresá un título para la tarea.'
    );
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('muestra un mensaje de error si onAdd rechaza la promesa (falla de red/Firestore)', async () => {
    const onAdd = vi.fn().mockRejectedValue(new Error('Firestore no disponible'));
    const user = userEvent.setup();
    render(<TaskForm onAdd={onAdd} />);

    await user.type(screen.getByPlaceholderText('¿Qué tenés pendiente hacer?'), 'Tarea válida');
    await user.click(screen.getByRole('button', { name: /agregar tarea/i }));

    expect(
      await screen.findByText('No se pudo crear la tarea. Intentá de nuevo.')
    ).toBeInTheDocument();
  });

  it('limpia el formulario después de agregar la tarea con éxito', async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TaskForm onAdd={onAdd} />);

    const titleInput = screen.getByPlaceholderText('¿Qué tenés pendiente hacer?');
    await user.type(titleInput, 'Tarea temporal');
    await user.click(screen.getByRole('button', { name: /agregar tarea/i }));

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
    });
  });
});