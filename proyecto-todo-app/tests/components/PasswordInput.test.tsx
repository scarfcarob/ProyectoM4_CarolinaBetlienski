
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from '../../src/components/PasswordInput';

function renderInput() {
  return render(
    <div>
      <label htmlFor="pw">Contraseña</label>
      <PasswordInput id="pw" name="password" value="abc123" onChange={() => {}} />
    </div>,
  );
}

describe('PasswordInput', () => {
  it('oculta la contraseña por defecto', () => {
    renderInput();
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toBeInTheDocument();
  });

  it('muestra la contraseña al hacer clic en el botón', async () => {
    const user = userEvent.setup();
    renderInput();

    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));

    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toBeInTheDocument();
  });

  it('vuelve a ocultar la contraseña con un segundo clic', async () => {
    const user = userEvent.setup();
    renderInput();

    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    await user.click(screen.getByRole('button', { name: 'Ocultar contraseña' }));

    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password');
  });
});
