
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Título de la tarea"
          aria-invalid={!!fieldErrors.title}
          aria-describedby={fieldErrors.title ? 'title-error' : undefined}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-100"
        />
        {fieldErrors.title && (
          <span id="title-error" role="alert" className="mt-1 block text-sm text-red-600">
            {fieldErrors.title}
          </span>
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
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-100"
        />
        {fieldErrors.description && (
          <span id="description-error" role="alert" className="mt-1 block text-sm text-red-600">
            {fieldErrors.description}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
      >
        {isSubmitting ? 'Agregando...' : 'Agregar tarea'}
      </button>

      {submitError && <ErrorMessage message={submitError} />}
    </form>
  );
}