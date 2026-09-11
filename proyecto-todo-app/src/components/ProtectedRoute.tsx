
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}