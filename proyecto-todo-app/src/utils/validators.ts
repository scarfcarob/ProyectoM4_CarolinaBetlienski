
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export interface LoginFormState {
  email: string;
  password: string;
}

export interface RegisterFormState {
  email: string;
  password: string;
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

  return errors;
}