
import { useAuthContext } from '../context/AuthContext';

export function TasksPage() {
  const { user, logout } = useAuthContext();

  return (
    <div>
      <p>Sesión iniciada como: {user?.email}</p>
      <button onClick={() => logout()}>Cerrar sesión</button>
      <h1>Mis tareas</h1>
      {/* CRUD de tareas */}
    </div>
  );
}