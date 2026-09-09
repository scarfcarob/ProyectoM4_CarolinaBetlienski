
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { ErrorMessage } from '../components/ErrorMessage';
import { Spinner } from '../components/Spinner';

export function RegisterPage() {
  const { register, error } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSuccess(false);
    setSubmitting(true);
    try {
      await register(email, password);
      setSuccess(true);
      setEmail('');
      setPassword('');
    } catch {
      //
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Registrarme</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? <Spinner size="sm" /> : 'Registrarme'}
        </button>
      </form>

      {error && <ErrorMessage message={error} />}
      {success && <p>¡Cuenta creada correctamente!</p>}
    </div>
  );
}