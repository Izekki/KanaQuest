import { useState } from 'react';
import FormField from '../forms/FormField';
import FormStatus from '../forms/FormStatus';
import TextField from '../forms/TextField';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { supabase } from '../../services/supabase/client';

const initialFormState = { email: '', password: '', username: '' };

export default function RegisterForm() {
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

    const { error } = await supabase.auth.signUp({
      email: formState.email,
      password: formState.password,
      options: {
        data: {
          username: formState.username,
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Cuenta creada. Revisa tu correo si necesitas confirmar el acceso.');
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
          />
        </FormField>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
        <FormStatus>{message}</FormStatus>
      </form>
    </Card>
  );
}
