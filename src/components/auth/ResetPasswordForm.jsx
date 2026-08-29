import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../forms/FormField';
import FormStatus from '../forms/FormStatus';
import TextField from '../forms/TextField';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { updateUser } from '../../services/supabase/auth';

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [statusTone, setStatusTone] = useState('default');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setStatusTone('default');

    if (password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      setStatusTone('error');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      setStatusTone('error');
      setLoading(false);
      return;
    }

    const { error } = await updateUser({ password });

    if (error) {
      setMessage(error.message);
      setStatusTone('error');
    } else {
      setShowToast(true);
      setPassword('');
      setConfirmPassword('');
      // Redirect to /game (dashboard) after 3 seconds
      setTimeout(() => {
        navigate('/game', { replace: true });
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <>
      {showToast && (
        <div className="fixed top-6 left-1/2 z-[9999] animate-toastSlideIn">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 shadow-xl shadow-emerald-900/10">
            <span className="text-xl" role="img" aria-label="success">
              ✅
            </span>
            <div>
              <p className="font-semibold text-emerald-900 text-sm">¡Contraseña actualizada!</p>
              <p className="text-xs text-emerald-700/95 mt-0.5 font-medium">
                Redirigiéndote a tu panel de juego...
              </p>
            </div>
          </div>
        </div>
      )}

      <Card
        eyebrow="Recuperación"
        title="Nueva contraseña"
        description="Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta."
      >
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <FormField label="Nueva contraseña" htmlFor="reset-password-input">
            <TextField
              id="reset-password-input"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </FormField>

          <FormField label="Confirmar nueva contraseña" htmlFor="reset-confirm-password-input">
            <TextField
              id="reset-confirm-password-input"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </FormField>

          <Button type="submit" disabled={loading || showToast}>
            {loading ? 'Actualizando contraseña...' : 'Actualizar contraseña'}
          </Button>

          <FormStatus tone={statusTone}>{message}</FormStatus>
        </form>
      </Card>
    </>
  );
}
