
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from '../../src/hooks/useAuth';

vi.mock('../../src/services/authService', () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  loginWithGoogle: vi.fn(),
  logoutUser: vi.fn(),
  subscribeToAuthChanges: vi.fn(),
}));

import { loginUser, logoutUser, subscribeToAuthChanges } from '../../src/services/authService';

describe('useAuth', () => {
  beforeEach(() => {
    vi.mocked(subscribeToAuthChanges).mockImplementation(() => () => {});
  });

  it('arranca en loading true y pasa a false cuando Firebase confirma que no hay sesión', async () => {
    let capturedCallback: ((user: null) => void) | undefined;
    vi.mocked(subscribeToAuthChanges).mockImplementation((callback) => {
      capturedCallback = callback;
      return () => {};
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);

    act(() => {
      capturedCallback?.(null);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user).toBeNull();
  });

  it('traduce el error al fallar el login con credenciales inválidas (caso de error)', async () => {
    vi.mocked(loginUser).mockRejectedValueOnce({ code: 'auth/wrong-password' });
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(result.current.login('a@a.com', 'mal')).rejects.toBeTruthy();
    });

    expect(result.current.error).toBe('La contraseña es incorrecta.');
  });

  it('limpia el error anterior al iniciar un nuevo intento de login', async () => {
    vi.mocked(loginUser).mockRejectedValueOnce({ code: 'auth/wrong-password' });
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(result.current.login('a@a.com', 'mal')).rejects.toBeTruthy();
    });
    expect(result.current.error).not.toBeNull();

    vi.mocked(loginUser).mockResolvedValueOnce({ uid: '1', email: 'a@a.com', displayName: null });

    await act(async () => {
      await result.current.login('a@a.com', 'bien');
    });

    expect(result.current.error).toBeNull();
  });

  it('llama a logoutUser al cerrar sesión', async () => {
    vi.mocked(logoutUser).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(logoutUser).toHaveBeenCalled();
  });
});