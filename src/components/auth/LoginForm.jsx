import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../forms/FormField';
import FormStatus from '../forms/FormStatus';
import TextField from '../forms/TextField';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { supabase } from '../../services/supabase/client';

const initialFormState = { email: '', password: '' };

export default function LoginForm() {
  const [formState, setFormState] = useState(initialFormState);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email: formState.email,
      password: formState.password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Signed in successfully.');
      setFormState(initialFormState);
    }

    setLoading(false);
  };

  return (
    <Card eyebrow="Autenticación" title="Iniciar sesión" description="Inicia sesión con tu cuenta para continuar tu progreso.">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <FormField label="Correo" htmlFor="login-email">
          <TextField
            id="login-email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            autoComplete="email"
            required
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
            required
          />
        </FormField>
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
        <FormStatus>{message}</FormStatus>
      </form>
    </Card>
  );
}
