import { useState, type FormEvent, type MouseEvent } from 'react';
import { Button, Input, Card } from '../ui';

interface LoginFormProps {
  onPasswordLogin: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  onPasswordReset: (email: string) => Promise<{ error: { message: string } | null }>;
}

export function LoginForm({ onPasswordLogin, onPasswordReset }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await onPasswordLogin(email, password);
    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      // Success - redirect will happen automatically via useAuth
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e?: MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setResetLoading(true);
    setError(null);
    setResetSent(false);

    const result = await onPasswordReset(email);
    if (result.error) {
      setError(result.error.message);
    } else {
      setResetSent(true);
    }
    setResetLoading(false);
  };

  return (
    <Card variant="elevated" className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {error && (
          <p className="text-sm text-error text-center">{error}</p>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          loading={loading}
          disabled={!email || !password}
        >
          Sign In
        </Button>

        <button
          type="button"
          className="block w-full text-center text-sm text-sunset hover:text-sunset-dark transition-colors"
          onClick={handlePasswordReset}
          disabled={!email || resetLoading}
        >
          {resetLoading ? 'Sending reset email...' : 'Forgot password?'}
        </button>

        {resetSent && (
          <p className="text-sm text-success text-center">
            Reset link sent. Check your email.
          </p>
        )}
      </form>
    </Card>
  );
}

