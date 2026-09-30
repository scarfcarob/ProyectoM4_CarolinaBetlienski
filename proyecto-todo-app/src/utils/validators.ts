
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export interface LoginFormState {
  email: string;
  password: string;
}

export interface RegisterFormState {
  email: string;
  password: string;
  confirmPassword: string;
}


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}


function validateEmailField(email: string): string | undefined {
  if (!email.trim()) {
    return 'Ingresá tu email.';
  }
  if (!isValidEmail(email)) {
    return 'Ingresá un email válido.';
  }
  return undefined;
}

export function validateLogin(form: LoginFormState): FieldErrors<LoginFormState> {
  const errors: FieldErrors<LoginFormState> = {};

  const emailError = validateEmailField(form.email);
  if (emailError) {
    errors.email = emailError;
  }

  if (!form.password.trim()) {
    errors.password = 'Ingresá tu contraseña.';
  }

  return errors;
}

export function validatePasswordMatch(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword) {
    return 'Confirmá tu contraseña.';
  }
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden.';
  }
  return undefined;
}

export function validateRegister(form: RegisterFormState): FieldErrors<RegisterFormState> {
  const errors: FieldErrors<RegisterFormState> = {};

  const emailError = validateEmailField(form.email);
  if (emailError) {
    errors.email = emailError;
  }

  if (!form.password.trim()) {
    errors.password = 'Ingresá una contraseña.';
  } else if (form.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  }

  const confirmError = validatePasswordMatch(form.password, form.confirmPassword);
  if (confirmError) {
    errors.confirmPassword = confirmError;
  }

  return errors;
}


export interface TaskFormState {
  title: string;
  description: string;
}

export function validateTask(form: TaskFormState): FieldErrors<TaskFormState> {
  const errors: FieldErrors<TaskFormState> = {};

  if (!form.title.trim()) {
    errors.title = 'Ingresá un título para la tarea.';
  } else if (form.title.trim().length > 100) {
    errors.title = 'El título no puede superar los 100 caracteres.';
  }

  if (form.description.trim().length > 500) {
    errors.description = 'La descripción no puede superar los 500 caracteres.';
  }

  return errors;
}