import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../forms/FormField';
import FormStatus from '../forms/FormStatus';
import TextField from '../forms/TextField';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { signUp } from '../../services/supabase/auth';
import { recordUserConsent, CURRENT_LEGAL_VERSION } from '../../services/supabase/consent';

const initialFormState = {
  email: '',
  password: '',
  username: '',
  termsAccepted: false,
};

export default function RegisterForm() {
  const [formState, setFormState] = useState(initialFormState);
  const [message, setMessage] = useState('');
  const [statusTone, setStatusTone] = useState('default');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (message) {
      setMessage('');
      setStatusTone('default');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setStatusTone('default');

    // Validación de consentimiento legal (LFPDPPP y Código de Comercio)
    if (!formState.termsAccepted) {
      setMessage('Debes leer y aceptar los Términos y Condiciones y el Aviso de Privacidad.');
      setStatusTone('error');
      setLoading(false);
      return;
    }

    const { data: signUpData, error } = await signUp(
      formState.email.trim(),
      formState.password,
      formState.username.trim(),
      {
        legal_consent: {
          terms_version: CURRENT_LEGAL_VERSION,
          privacy_version: CURRENT_LEGAL_VERSION,
          terms_accepted: true,
          accepted_at: new Date().toISOString(),
        },
      }
    );

    if (error) {
      const raw = (error.message || '').toLowerCase();
      let friendlyText = 'No fue posible crear la cuenta. Por favor, verifica tus datos e inténtalo de nuevo.';

      if (raw.includes('already registered') || raw.includes('user already exists')) {
        friendlyText = 'Ya existe una cuenta con este correo. Por favor, inicia sesión.';
      } else if (raw.includes('at least 6 characters')) {
        friendlyText = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (raw.includes('valid email')) {
        friendlyText = 'Por favor, ingresa un correo electrónico válido.';
      }

      setMessage(friendlyText);
      setStatusTone('error');
    } else {
      // Registro auditable en tabla user_consents de Supabase
      const newUserId = signUpData?.user?.id ?? null;
      if (newUserId) {
        recordUserConsent({
          userId: newUserId,
          consentType: 'terms_and_privacy',
          documentVersion: CURRENT_LEGAL_VERSION,
          accepted: true,
          metadata: {
            registration_flow: 'email_signup',
          },
        }).catch(() => {});
      }

      setMessage('¡Cuenta creada con éxito! Revisa tu correo si necesitas confirmar el acceso.');
      setStatusTone('success');
      setFormState(initialFormState);
    }

    setLoading(false);
  };

  return (
    <Card eyebrow="Autenticación" title="Crear cuenta" description="Crea tu cuenta para acceder y guardar tu progreso.">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <FormField label="Nombre de usuario" htmlFor="register-username">
          <TextField
            id="register-username"
            name="username"
            type="text"
            value={formState.username}
            onChange={handleChange}
            autoComplete="nickname"
            required
            placeholder="Tu apodo o nombre"
          />
        </FormField>
        <FormField label="Correo" htmlFor="register-email">
          <TextField
            id="register-email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            autoComplete="email"
            required
            placeholder="ejemplo@correo.com"
          />
        </FormField>
        <FormField label="Contraseña" htmlFor="register-password">
          <TextField
            id="register-password"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
            placeholder="Mínimo 6 caracteres"
          />
        </FormField>

        {/* Casilla de Consentimiento Legal Unificada (Opción A) */}
        <div className="pt-2 pb-1 border-t border-[#f0e4dd] text-xs">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="termsAccepted"
              id="register-terms-accepted"
              checked={formState.termsAccepted}
              onChange={handleChange}
              required
              className="mt-0.5 h-4 w-4 rounded border-[#d4c3ba] text-[#6b2832] focus:ring-[#6b2832] focus:ring-offset-0 cursor-pointer accent-[#6b2832]"
            />
            <span className="text-[rgb(var(--color-neutral))]/85 leading-snug">
              He leído y acepto los{' '}
              <Link
                to="/terminos"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#6b2832] underline hover:text-[#581f27]"
              >
                Términos y Condiciones
              </Link>{' '}
              y el{' '}
              <Link
                to="/privacidad"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#6b2832] underline hover:text-[#581f27]"
              >
                Aviso de Privacidad
              </Link>.
            </span>
          </label>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>

        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[rgb(var(--color-neutral))]/45">
          <span className="h-px flex-1 bg-[#eaded6]" />
          <span>Ó</span>
          <span className="h-px flex-1 bg-[#eaded6]" />
        </div>
        <Button as={Link} to="/login" variant="secondary">
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
        <FormStatus tone={statusTone}>{message}</FormStatus>
      </form>
    </Card>
  );
}
