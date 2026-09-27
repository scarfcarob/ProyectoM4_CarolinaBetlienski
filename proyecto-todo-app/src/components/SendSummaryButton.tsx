
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
    <div className="flex flex-col items-start sm:items-end gap-1.5 w-full sm:w-auto">
      <button
        onClick={handleClick}
        disabled={status === 'loading'}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100/80 active:bg-violet-200 border border-violet-200/60 rounded-xl px-4 py-2.5 transition-all shadow-sm"
      >
        <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {status === 'loading' ? 'Enviando...' : 'Enviar resumen por email'}
      </button>
      {feedback && (
        <p
          role="status"
          className={
            status === 'error'
              ? 'text-xs font-medium text-red-600'
              : status === 'success'
              ? 'text-xs font-medium text-emerald-600'
              : 'text-xs text-gray-500'
          }
        >
          {feedback}
        </p>
      )}
    </div>
  );
}

