
export interface TaskSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export async function sendTasksSummaryEmail(to: string, summary: TaskSummary): Promise<void> {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, ...summary }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? 'No se pudo enviar el email.');
  }
}