
import { useState } from 'react';
import { sendTasksSummaryEmail, type TaskSummary } from '../services/emailService';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface SendSummaryButtonProps {
  userEmail: string | null;
  summary: TaskSummary;
}

export function SendSummaryButton({ userEmail, summary }: SendSummaryButtonProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [feedback, setFeedback] = useState('');

  async function handleClick() {
    if (!userEmail) {
      setStatus('error');
      setFeedback('No se pudo determinar tu email de usuario.');
      return;
    }

    setStatus('loading');
    setFeedback('Enviando resumen...');

    try {
      await sendTasksSummaryEmail(userEmail, summary);
      setStatus('success');
      setFeedback('Resumen enviado correctamente.');
    } catch (error) {
      setStatus('error');
      setFeedback(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={status === 'loading'}
        className="text-sm font-medium text-violet-600 hover:text-violet-700 disabled:text-violet-300 border border-violet-200 hover:bg-violet-50 rounded-lg px-4 py-2 transition-colors"
      >
        {status === 'loading' ? 'Enviando...' : 'Enviar resumen por email'}
      </button>
      {feedback && (
        <p
          role="status"
          className={
            status === 'error'
              ? 'text-xs text-red-600'
              : status === 'success'
              ? 'text-xs text-green-600'
              : 'text-xs text-gray-500'
          }
        >
          {feedback}
        </p>
      )}
    </div>
  );
}

