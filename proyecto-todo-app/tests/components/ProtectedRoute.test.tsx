
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../src/components/ProtectedRoute';
import { AuthContext, type AuthContextType } from '../../src/context/AuthContext';

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

function renderProtected(authValue: AuthContextType) {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={['/tasks']}>
        <Routes>
          <Route path="/login" element={<p>Pantalla de login</p>} />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <p>Contenido protegido</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('ProtectedRoute', () => {
  it('muestra un estado de carga mientras la auth todavía no resolvió (caso borde)', () => {
    renderProtected(buildAuthValue({ loading: true, user: null }));

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('redirige a /login si terminó de cargar y no hay usuario', () => {
    renderProtected(buildAuthValue({ loading: false, user: null }));

    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('muestra el contenido protegido si hay un usuario logueado', () => {
    renderProtected(
      buildAuthValue({
        loading: false,
        user: { uid: '1', email: 'a@a.com', displayName: null },
      })
    );

    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
    expect(screen.queryByText('Pantalla de login')).not.toBeInTheDocument();
  });
});