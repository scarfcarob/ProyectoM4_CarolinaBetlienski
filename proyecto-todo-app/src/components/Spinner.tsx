
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ size = 'md' }: SpinnerProps) {
  return <span role="status" aria-label="Cargando" className={`spinner spinner--${size}`} />;
}