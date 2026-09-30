
import { useState } from 'react';
import type { FormEvent } from 'react';
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="¿Qué tenés pendiente hacer?"
          aria-invalid={!!fieldErrors.title}
          aria-describedby={fieldErrors.title ? 'title-error' : undefined}
          disabled={isSubmitting}
          className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-gray-100 transition-all"
        />
        {fieldErrors.title && (
          <span id="title-error" role="alert" className="mt-1 block text-xs font-medium text-red-600">
            {fieldErrors.title}
          </span>
        )}
      </div>

      <div>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Añadir una descripción detallada (opcional)"
          rows={2}
          aria-invalid={!!fieldErrors.description}
          aria-describedby={fieldErrors.description ? 'description-error' : undefined}
          disabled={isSubmitting}
          className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-gray-100 transition-all resize-none"
        />
        {fieldErrors.description && (
          <span id="description-error" role="alert" className="mt-1 block text-xs font-medium text-red-600">
            {fieldErrors.description}
          </span>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            'Agregando...'
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar tarea
            </>
          )}
        </button>
      </div>

      {submitError && <ErrorMessage message={submitError} />}
    </form>
  );
}