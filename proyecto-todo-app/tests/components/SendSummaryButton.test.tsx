
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SendSummaryButton } from '../../src/components/SendSummaryButton';

vi.mock('../../src/services/emailService', () => ({
  sendTasksSummaryEmail: vi.fn(),
}));

import { sendTasksSummaryEmail } from '../../src/services/emailService';

const summary = { totalTasks: 3, completedTasks: 1, pendingTasks: 2 };

describe('SendSummaryButton', () => {
  it('muestra estado de éxito cuando el servicio resuelve OK', async () => {
    vi.mocked(sendTasksSummaryEmail).mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<SendSummaryButton userEmail="user@test.com" summary={summary} />);

    await user.click(screen.getByRole('button', { name: /enviar resumen por email/i }));

    expect(await screen.findByText('Resumen enviado correctamente.')).toBeInTheDocument();
    expect(sendTasksSummaryEmail).toHaveBeenCalledWith('user@test.com', summary);
  });

  it('muestra un mensaje de error si el servicio falla (caso borde)', async () => {
    vi.mocked(sendTasksSummaryEmail).mockRejectedValueOnce(
      new Error('No se pudo enviar el email.')
    );
    const user = userEvent.setup();
    render(<SendSummaryButton userEmail="user@test.com" summary={summary} />);

    await user.click(screen.getByRole('button', { name: /enviar resumen por email/i }));

    expect(await screen.findByText('No se pudo enviar el email.')).toBeInTheDocument();
  });

  it('no llama al servicio si no hay email de usuario (caso borde)', async () => {
    const user = userEvent.setup();
    render(<SendSummaryButton userEmail={null} summary={summary} />);

    await user.click(screen.getByRole('button', { name: /enviar resumen por email/i }));

    expect(
      await screen.findByText('No se pudo determinar tu email de usuario.')
    ).toBeInTheDocument();
    expect(sendTasksSummaryEmail).not.toHaveBeenCalled();
  });
});