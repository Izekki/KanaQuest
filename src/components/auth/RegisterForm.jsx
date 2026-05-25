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
      setMessage('Account created. Check your email to confirm if required.');
      setFormState(initialFormState);
    }

    setLoading(false);
  };

  return (
    <Card eyebrow="Auth" title="Create account" description="Register with Supabase to track your progress.">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <FormField label="Username" htmlFor="register-username">
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
        <FormField label="Email" htmlFor="register-email">
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
        <FormField label="Password" htmlFor="register-password">
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
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
        <FormStatus>{message}</FormStatus>
      </form>
    </Card>
  );
}
