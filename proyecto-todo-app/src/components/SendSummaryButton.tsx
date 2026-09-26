
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
    <div>
      <button onClick={handleClick} disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando...' : 'Enviar resumen por email'}
      </button>
      {feedback && <p role="status">{feedback}</p>}
    </div>
  );
}

