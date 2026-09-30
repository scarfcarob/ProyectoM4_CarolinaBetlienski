
import { describe, it, expect } from 'vitest';
import { validateTask, validateLogin, validateRegister } from '../../src/utils/validators';

describe('validateTask', () => {
  it('no devuelve errores para un título y descripción válidos', () => {
    const form = { title: 'Comprar leche', description: 'En el súper de la esquina' };
    const errors = validateTask(form);
    expect(errors).toEqual({});
  });

  it('marca error si el título está vacío', () => {
    const form = { title: '   ', description: '' };
    const errors = validateTask(form);
    expect(errors.title).toBe('Ingresá un título para la tarea.');
  });

  it('marca error si el título supera los 100 caracteres', () => {
    const form = { title: 'a'.repeat(101), description: '' };
    const errors = validateTask(form);
    expect(errors.title).toBe('El título no puede superar los 100 caracteres.');
  });

  it('marca error si la descripción supera los 500 caracteres', () => {
    const form = { title: 'Título válido', description: 'a'.repeat(501) };
    const errors = validateTask(form);
    expect(errors.description).toBe('La descripción no puede superar los 500 caracteres.');
  });
});

describe('validateLogin', () => {
  it('no devuelve errores con email y password válidos', () => {
    const errors = validateLogin({ email: 'user@test.com', password: '123456' });
    expect(errors).toEqual({});
  });

  it('marca error si el email no tiene formato válido', () => {
    const errors = validateLogin({ email: 'no-es-un-email', password: '123456' });
    expect(errors.email).toBe('Ingresá un email válido.');
  });

  it('marca error si el password está vacío', () => {
    const errors = validateLogin({ email: 'user@test.com', password: '' });
    expect(errors.password).toBe('Ingresá tu contraseña.');
  });
});

describe('validateRegister', () => {
  it('marca error si el password tiene menos de 6 caracteres', () => {
    const errors = validateRegister({ email: 'user@test.com', password: '123' });
    expect(errors.password).toBe('La contraseña debe tener al menos 6 caracteres.');
  });

  it('no devuelve errores con datos válidos', () => {
    const errors = validateRegister({ email: 'user@test.com', password: '123456' });
    expect(errors).toEqual({});
  });
});