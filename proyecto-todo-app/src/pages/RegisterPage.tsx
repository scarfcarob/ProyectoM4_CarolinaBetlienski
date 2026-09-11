
import { useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { ErrorMessage } from '../components/ErrorMessage';
import { Spinner } from '../components/Spinner';
import { validateRegister } from '../utils/validators';
import type { RegisterFormState, FieldErrors } from '../utils/validators';

const initialRegisterForm: RegisterFormState = { email: '', password: '' };

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, error: submitError, clearError } = useAuthContext();
  const [form, setForm] = useState<RegisterFormState>(initialRegisterForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<RegisterFormState>>({});
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

    const errors = validateRegister(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      await register(form.email, form.password);
      setSubmitSuccess(true);
      setForm(initialRegisterForm);
      setFieldErrors({});
      navigate('/tasks', { replace: true });
    } catch {
      // 
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Registrarme</h1>
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
          {isSubmitting ? <Spinner size="sm" /> : 'Registrarme'}
        </button>

        {submitSuccess && <p>¡Cuenta creada correctamente!</p>}
      </form>
    </div>
  );
}