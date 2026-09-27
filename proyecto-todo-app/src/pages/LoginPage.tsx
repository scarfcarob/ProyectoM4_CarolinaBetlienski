
import { useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { ErrorMessage } from '../components/ErrorMessage';
import { Spinner } from '../components/Spinner';
import { validateLogin } from '../utils/validators';
import type { LoginFormState, FieldErrors } from '../utils/validators';

const initialLoginForm: LoginFormState = { email: '', password: '' };

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const { login, loginGoogle, error: submitError, clearError } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState<LoginFormState>(initialLoginForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoginFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function redirectAfterAuth() {
    const state = location.state as LocationState | null;
    const from = state?.from?.pathname ?? '/tasks';
    navigate(from, { replace: true });
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitSuccess(false);
    clearError();

    const errors = validateLogin(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      await login(form.email, form.password);
      setSubmitSuccess(true);
      setForm(initialLoginForm);
      setFieldErrors({});
      redirectAfterAuth();
    } catch {
      //
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    clearError();
    setIsGoogleSubmitting(true);
    try {
      await loginGoogle();
      redirectAfterAuth();
    } catch {
      //
    } finally {
      setIsGoogleSubmitting(false);
    }
  }

  const isAnySubmitting = isSubmitting || isGoogleSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Iniciar sesión</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Ingresá para gestionar tus tareas.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              disabled={isAnySubmitting}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-100"
            />
            {fieldErrors.email && (
              <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleInputChange}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              disabled={isAnySubmitting}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-100"
            />
            {fieldErrors.password && (
              <p id="password-error" role="alert" className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {submitError && <ErrorMessage message={submitError} />}

          <button
            type="submit"
            disabled={isAnySubmitting}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-medium rounded-lg py-2.5 transition-colors"
          >
            {isSubmitting ? <Spinner size="sm" /> : 'Iniciar sesión'}
          </button>

          {submitSuccess && (
            <p className="text-sm text-green-600 text-center">¡Sesión iniciada correctamente!</p>
          )}
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">o</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isAnySubmitting}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 font-medium rounded-lg py-2.5 transition-colors"
        >
          {isGoogleSubmitting ? (
            <Spinner size="sm" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 19 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6.1 29.5 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z" />
                <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.3C29.4 35.2 26.8 36 24 36c-5.2 0-9.6-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.3 5.3C40.3 36 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z" />
              </svg>
              Continuar con Google
            </>
          )}
        </button>

        <p className="text-sm text-gray-500 text-center mt-6">
          ¿No tenés una cuenta?{' '}
          <Link to="/register" className="text-violet-600 font-medium hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}