
import { useState } from 'react';
import type { NewTask } from '../types/task';
import { validateTask, type FieldErrors, type TaskFormState } from '../utils/validators';
import { ErrorMessage } from './ErrorMessage';

interface TaskFormProps {
  onAdd: (task: NewTask) => Promise<void>;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [form, setForm] = useState<TaskFormState>({ title: '', description: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TaskFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors = validateTask(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onAdd({ title: form.title.trim(), description: form.description.trim() });
      setForm({ title: '', description: '' });
    } catch {
      setSubmitError('No se pudo crear la tarea. Intentá de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Título de la tarea"
          aria-invalid={!!fieldErrors.title}
          aria-describedby={fieldErrors.title ? 'title-error' : undefined}
          disabled={isSubmitting}
        />
        {fieldErrors.title && (
          <span id="title-error" role="alert">{fieldErrors.title}</span>
        )}
      </div>

      <div>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Descripción (opcional)"
          aria-invalid={!!fieldErrors.description}
          aria-describedby={fieldErrors.description ? 'description-error' : undefined}
          disabled={isSubmitting}
        />
        {fieldErrors.description && (
          <span id="description-error" role="alert">{fieldErrors.description}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Agregando...' : 'Agregar tarea'}
      </button>

      {submitError && <ErrorMessage message={submitError} />}
    </form>
  );
}