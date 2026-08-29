import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../forms/FormField';
import FormStatus from '../forms/FormStatus';
import TextField from '../forms/TextField';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { resetPasswordForEmail } from '../../services/supabase/auth';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [statusTone, setStatusTone] = useState('default');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setStatusTone('default');

    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await resetPasswordForEmail(email, { redirectTo });

    if (error) {
      setMessage(error.message);
      setStatusTone('error');
    } else {
      setMessage('Revisa tu bandeja de entrada para continuar');
      setStatusTone('success');
      setEmail('');
    }

    setLoading(false);
  };

  return (
    <Card
      eyebrow="Recuperación"
      title="Recuperar contraseña"
      description="Ingresa tu correo electrónico registrado y te enviaremos un enlace para restablecer tu contraseña."
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <FormField label="Correo electrónico" htmlFor="forgot-email">
          <TextField
            id="forgot-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </FormField>

        <Button type="submit" disabled={loading}>
          {loading ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
        </Button>

        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[rgb(var(--color-neutral))]/45">
          <span className="h-px flex-1 bg-[#eaded6]" />
          <span>Ó</span>
          <span className="h-px flex-1 bg-[#eaded6]" />
        </div>

        <Button as={Link} to="/login" variant="secondary">
          Volver a iniciar sesión
        </Button>

        <FormStatus tone={statusTone}>{message}</FormStatus>
      </form>
    </Card>
  );
}
