import { useState, type FormEvent, type MouseEvent } from 'react';
import { Button, Input, Card } from '../ui';

type LoginMode = 'magic_link' | 'password';

interface LoginFormProps {
  onMagicLink: (email: string) => Promise<{ error: { message: string } | null }>;
  onPasswordLogin: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  onPasswordReset: (email: string) => Promise<{ error: { message: string } | null }>;
}

export function LoginForm({ onMagicLink, onPasswordLogin, onPasswordReset }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<LoginMode>('magic_link');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleMagicLinkSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await onMagicLink(email);
    if (result.error) {
      setError(result.error.message);
    } else {
      setMagicLinkSent(true);
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
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

  const switchMode = (newMode: LoginMode) => {
    setMode(newMode);
    setError(null);
    setMagicLinkSent(false);
    setResetSent(false);
  };

  // Magic link sent success state
  if (magicLinkSent) {
    return (
      <Card variant="elevated" className="max-w-md mx-auto text-center">
        <div className="py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl mb-2">Check your email</h3>
          <p className="text-slate mb-4">
            We've sent a magic link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-slate">
            Click the link in the email to sign in.
          </p>
          <button
            type="button"
            className="mt-6 text-sm text-sunset hover:text-sunset-dark transition-colors"
            onClick={() => {
              setMagicLinkSent(false);
              setEmail('');
            }}
          >
            Use a different email
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="max-w-md mx-auto">
      {mode === 'magic_link' ? (
        <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            required
            autoFocus
          />
          
          {error && !error.includes('No user account found') && (
            <p className="text-sm text-error text-center">{error}</p>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            loading={loading}
            disabled={!email}
          >
            Send Magic Link
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              className="text-sm text-sunset hover:text-sunset-dark transition-colors"
              onClick={() => switchMode('password')}
            >
              Sign in with password
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            required
            autoFocus
          />
          
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            required
          />
          
          {error && !error.includes('No user account found') && (
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

          <div className="flex justify-center gap-4 pt-2">
            <button
              type="button"
              className="text-sm text-sunset hover:text-sunset-dark transition-colors"
              onClick={() => switchMode('magic_link')}
            >
              Use magic link instead
            </button>
            <span className="text-slate">•</span>
            <button
              type="button"
              className="text-sm text-sunset hover:text-sunset-dark transition-colors"
              onClick={handlePasswordReset}
              disabled={!email || resetLoading}
            >
              {resetLoading ? 'Sending...' : 'Forgot password?'}
            </button>
          </div>

          {resetSent && (
            <p className="text-sm text-success text-center">
              Reset link sent. Check your email.
            </p>
          )}
        </form>
      )}
    </Card>
  );
}
