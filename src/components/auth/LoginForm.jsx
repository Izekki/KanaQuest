import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../forms/FormField';
import FormStatus from '../forms/FormStatus';
import TextField from '../forms/TextField';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { signIn } from '../../services/supabase/auth';

const initialFormState = { email: '', password: '' };

export default function LoginForm() {
  const [formState, setFormState] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasCredentialsError, setHasCredentialsError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
    // Quita el resaltado de error y el aviso en cuanto el usuario empiece a editar
    if (hasCredentialsError || errorMessage) {
      setHasCredentialsError(false);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setHasCredentialsError(false);

    const { error } = await signIn(formState.email.trim(), formState.password);

    if (error) {
      const raw = (error.message || '').toLowerCase();
      let friendlyText = 'No fue posible iniciar sesión';
      let credentialsFault = false;

      if (
        raw.includes('invalid login credentials') ||
        raw.includes('invalid_grant') ||
        raw.includes('invalid credentials')
      ) {
        friendlyText = 'Correo o contraseña incorrectos';
        credentialsFault = true;
      } else if (raw.includes('email not confirmed')) {
        friendlyText = 'Cuenta pendiente de confirmación';
      } else if (raw.includes('too many requests') || raw.includes('rate limit')) {
        friendlyText = 'Demasiados intentos. Espera un momento';
      } else if (raw.includes('network') || raw.includes('fetch') || raw.includes('failed to fetch')) {
        friendlyText = 'Sin conexión con el servidor';
      }

      setErrorMessage(friendlyText);
      if (credentialsFault) {
        setHasCredentialsError(true);
      }

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    } else {
      setSuccessMessage('¡Inicio de sesión exitoso! Entrando...');
      setFormState(initialFormState);
    }

    setLoading(false);
  };

  return (
    <Card
      className="h-full flex flex-col justify-between"
      eyebrow="Autenticación"
      title="Iniciar sesión"
      description="Inicia sesión con tu cuenta para continuar tu progreso."
    >
      <form
        className={`grid gap-4 transition-transform ${isShaking ? 'animate-shake-subtle' : ''}`}
        onSubmit={handleSubmit}
      >
        <FormField label="Correo" htmlFor="login-email">
          <TextField
            id="login-email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            autoComplete="email"
            error={hasCredentialsError}
            required
            placeholder="ejemplo@correo.com"
          />
        </FormField>

        <FormField label="Contraseña" htmlFor="login-password">
          <TextField
            id="login-password"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
            autoComplete="current-password"
            error={hasCredentialsError}
            required
            placeholder="••••••••"
          />
        </FormField>

        {/* Fila fija sin layout-shift: error inline a la izquierda y link a la derecha */}
        <div className="flex items-center justify-between min-h-[22px] gap-2">
          <div className="min-h-[18px] flex items-center">
            {errorMessage ? (
              <p
                role="alert"
                className="flex items-center gap-1.5 text-xs font-medium text-rose-600 animate-fadeIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5 shrink-0 text-rose-500"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{errorMessage}</span>
              </p>
            ) : null}
          </div>
          <Link
            to="/forgot-password"
            className="shrink-0 text-xs font-medium text-[rgb(var(--color-accent))]/80 hover:text-[rgb(var(--color-accent))] hover:underline ml-auto"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>

        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[rgb(var(--color-neutral))]/45">
          <span className="h-px flex-1 bg-[#eaded6]" />
          <span>Ó</span>
          <span className="h-px flex-1 bg-[#eaded6]" />
        </div>

        <Button as={Link} to="/register" variant="secondary">
          Regístrate
        </Button>

        <div className="min-h-[20px] text-center">
          {successMessage && (
            <FormStatus tone="success">{successMessage}</FormStatus>
          )}
        </div>
      </form>
    </Card>
  );
}
