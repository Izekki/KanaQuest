import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../forms/FormField';
import FormStatus from '../forms/FormStatus';
import TextField from '../forms/TextField';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { signUp } from '../../services/supabase/auth';

const initialFormState = { email: '', password: '', username: '' };

export default function RegisterForm() {
  const [formState, setFormState] = useState(initialFormState);
  const [message, setMessage] = useState('');
  const [statusTone, setStatusTone] = useState('default');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
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

    const { error } = await signUp(
      formState.email.trim(),
      formState.password,
      formState.username.trim()
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

