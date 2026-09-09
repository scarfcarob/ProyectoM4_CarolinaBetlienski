
interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return <p role="alert" style={{ color: 'red' }}>{message}</p>;
}