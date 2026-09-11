
import { useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const { login, error: submitError, clearError } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState<LoginFormState>(initialLoginForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoginFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

      const state = location.state as LocationState | null;
      const from = state?.from?.pathname ?? '/tasks';
      navigate(from, { replace: true });
    } catch {
      // 
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleInputChange}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            disabled={isSubmitting}
          />
          {fieldErrors.email && (
            <p id="email-error" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleInputChange}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            disabled={isSubmitting}
          />
          {fieldErrors.password && (
            <p id="password-error" role="alert">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {submitError && <ErrorMessage message={submitError} />}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner size="sm" /> : 'Login'}
        </button>

        {submitSuccess && <p>¡Sesión iniciada correctamente!</p>}
      </form>
    </div>
  );
}