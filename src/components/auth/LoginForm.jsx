import { useState } from 'react';
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
    <Card eyebrow="Auth" title="Sign in" description="Connect your Supabase account to resume progress.">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <FormField label="Email" htmlFor="login-email">
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
        <FormField label="Password" htmlFor="login-password">
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
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
        <FormStatus>{message}</FormStatus>
      </form>
    </Card>
  );
}
