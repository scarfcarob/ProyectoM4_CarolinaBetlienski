
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useTasks } from '../../src/hooks/useTasks';
import { AuthContext, type AuthContextType } from '../../src/context/AuthContext';
import type { Task } from '../../src/types/task';

vi.mock('../../src/services/tasksService', () => ({
  subscribeToUserTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

import * as tasksService from '../../src/services/tasksService';

function buildAuthValue(overrides: Partial<AuthContextType> = {}): AuthContextType {
  return {
    user: null,
    loading: false,
    error: null,
    register: vi.fn(),
    login: vi.fn(),
    loginGoogle: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn(),
    ...overrides,
  };
}

function wrapperWith(authValue: AuthContextType) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
  };
}

describe('useTasks', () => {
  it('no se suscribe a Firestore mientras la auth todavía está cargando (caso borde)', () => {
    const authValue = buildAuthValue({ loading: true, user: null });
    const { result } = renderHook(() => useTasks(), { wrapper: wrapperWith(authValue) });

    expect(tasksService.subscribeToUserTasks).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(true);
  });

  it('devuelve lista vacía y loading false si no hay usuario (sesión cerrada)', async () => {
    const authValue = buildAuthValue({ loading: false, user: null });
    const { result } = renderHook(() => useTasks(), { wrapper: wrapperWith(authValue) });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.tasks).toEqual([]);
    expect(tasksService.subscribeToUserTasks).not.toHaveBeenCalled();
  });

  it('se suscribe a las tareas del usuario logueado', async () => {
    const fakeTask: Task = {
      id: '1',
      title: 'Tarea de prueba',
      description: '',
      completed: false,
      userId: 'user-1',
      createdAt: null,
    };
    vi.mocked(tasksService.subscribeToUserTasks).mockImplementation((_userId, onChange) => {
      onChange([fakeTask]);
      return () => {};
    });
    const authValue = buildAuthValue({
      loading: false,
      user: { uid: 'user-1', email: 'a@a.com', displayName: null },
    });

    const { result } = renderHook(() => useTasks(), { wrapper: wrapperWith(authValue) });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });
    expect(tasksService.subscribeToUserTasks).toHaveBeenCalledWith(
      'user-1',
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('addTask llama a createTask con el uid del usuario logueado', async () => {
    vi.mocked(tasksService.subscribeToUserTasks).mockImplementation(() => () => {});
    const authValue = buildAuthValue({
      loading: false,
      user: { uid: 'user-1', email: 'a@a.com', displayName: null },
    });

    const { result } = renderHook(() => useTasks(), { wrapper: wrapperWith(authValue) });

    await result.current.addTask({ title: 'Nueva', description: '' });

    expect(tasksService.createTask).toHaveBeenCalledWith('user-1', {
      title: 'Nueva',
      description: '',
    });
  });

  it('propaga el error si Firestore falla al sincronizar (caso de error)', async () => {
    vi.mocked(tasksService.subscribeToUserTasks).mockImplementation(
      (_userId, _onChange, onError) => {
        onError(new Error('permiso denegado'));
        return () => {};
      }
    );
    const authValue = buildAuthValue({
      loading: false,
      user: { uid: 'user-1', email: 'a@a.com', displayName: null },
    });

    const { result } = renderHook(() => useTasks(), { wrapper: wrapperWith(authValue) });

    await waitFor(() => {
      expect(result.current.error).toBe('permiso denegado');
    });
    expect(result.current.loading).toBe(false);
  });
});