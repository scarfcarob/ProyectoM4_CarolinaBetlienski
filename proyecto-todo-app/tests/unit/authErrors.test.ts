
import { describe, it, expect } from 'vitest';
import { getAuthErrorMessage } from '../../src/utils/authErrors';

describe('getAuthErrorMessage', () => {
  it('traduce un código conocido de Firebase', () => {
    const error = { code: 'auth/wrong-password' };
    const message = getAuthErrorMessage(error);
    expect(message).toBe('La contraseña es incorrecta.');
  });

  it('traduce el código de red agregado', () => {
    const error = { code: 'auth/network-request-failed' };
    const message = getAuthErrorMessage(error);
    expect(message).toBe('No hay conexión a internet. Revisá tu red e intentá de nuevo.');
  });

  it('devuelve un mensaje genérico si el código no está mapeado', () => {
    const error = { code: 'auth/algo-nuevo-que-firebase-agrego' };
    const message = getAuthErrorMessage(error);
    expect(message).toBe('Ocurrió un error inesperado. Intentá de nuevo.');
  });

  it('devuelve un mensaje genérico si el error no tiene la forma esperada', () => {
    const message = getAuthErrorMessage('esto no es un error de Firebase');
    expect(message).toBe('Ocurrió un error inesperado. Intentá de nuevo.');
  });
});