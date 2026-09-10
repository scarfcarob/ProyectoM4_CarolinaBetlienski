
import { useEffect, useState } from 'react';
import {
  registerUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
  subscribeToAuthChanges,
} from '../services/authService';
import type { AuthUser } from '../types/user';
import { getAuthErrorMessage } from '../utils/authErrors';


export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  function clearError() {
    setError(null);
  }

  async function register(email: string, password: string) {
    setError(null);
    try {
      await registerUser(email, password);
    } catch (err) {
      setError(getAuthErrorMessage(err));
      throw err;
    }
  }

  async function login(email: string, password: string) {
    setError(null);
    try {
      await loginUser(email, password);
    } catch (err) {
      setError(getAuthErrorMessage(err));
      throw err;
    }
  }

  async function loginGoogle() {
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(getAuthErrorMessage(err));
      throw err;
    }
  }

  async function logout() {
    setError(null);
    try {
      await logoutUser();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  }

  return { user, loading, error, register, login, loginGoogle, logout, clearError };
}